import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  // 🔔 Notification yaratish
  async create(
    userId: string,
    dto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId,
      ...dto,
    });

    return this.notificationRepo.save(notification);
  }

  // 📥 Foydalanuvchi notificationlari
  async findAll(
    userId: string,
    query: GetNotificationsDto,
  ): Promise<Notification[]> {
    const where: any = { userId };

    if (query.read !== undefined) {
      where.read = query.read;
    }

    if (query.type) {
      where.type = query.type;
    }

    return this.notificationRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // 🔍 Bitta notification
  async findOne(userId: string, id: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  // ✏️ Yangilash (read qilish)
  async update(
    userId: string,
    id: string,
    dto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(userId, id);

    Object.assign(notification, dto);
    return this.notificationRepo.save(notification);
  }

  // 🗑 O‘chirish
  async remove(userId: string, id: string): Promise<void> {
    const notification = await this.findOne(userId, id);
    await this.notificationRepo.remove(notification);
  }
}
