import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FriendRequest,
  FriendRequestStatus,
} from './entities/friend-request.entity';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateFriendRequestDto): Promise<FriendRequest> {
    if (dto.fromUserId === dto.toUserId)
      throw new BadRequestException('You cannot send a request to yourself');

    const fromUser = await this.userRepo.findOneBy({ id: dto.fromUserId });
    const toUser = await this.userRepo.findOneBy({ id: dto.toUserId });

    if (!fromUser || !toUser) throw new NotFoundException('User not found');

    const existing = await this.friendRequestRepo.findOne({
      where: { fromUserId: dto.fromUserId, toUserId: dto.toUserId },
    });
    if (existing) throw new BadRequestException('Friend request already sent');

    const request = this.friendRequestRepo.create({
      fromUser,
      toUser,
      fromUserId: fromUser.id,
      toUserId: toUser.id,
    });

    return this.friendRequestRepo.save(request);
  }

  async updateStatus(
    id: string,
    dto: UpdateFriendRequestDto,
  ): Promise<FriendRequest> {
    const request = await this.friendRequestRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Friend request not found');

    request.status = dto.status;
    return this.friendRequestRepo.save(request);
  }

  async findAll(userId?: string): Promise<FriendRequest[]> {
    if (userId) {
      return this.friendRequestRepo.find({
        where: [{ fromUserId: userId }, { toUserId: userId }],
        relations: ['fromUser', 'toUser'],
      });
    }
    return this.friendRequestRepo.find({ relations: ['fromUser', 'toUser'] });
  }

  async findOne(id: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepo.findOne({
      where: { id },
      relations: ['fromUser', 'toUser'],
    });
    if (!request) throw new NotFoundException('Friend request not found');
    return request;
  }

  async remove(id: string): Promise<void> {
    const request = await this.friendRequestRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Friend request not found');
    await this.friendRequestRepo.remove(request);
  }
}
