import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from '../message/entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { In } from 'typeorm'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Yangi chat yaratish
  async createChat(dto: CreateChatDto) {
    const participants = await this.userRepo.find({where:{id:In(dto.participantIds)}});

    const chat = this.chatRepo.create({ participants });
    await this.chatRepo.save(chat);

    if (dto.text && dto.initialMessageSenderId) {
      const message = this.messageRepo.create({
        chat,
        senderId: dto.initialMessageSenderId,
        text: dto.text,
      });
      await this.messageRepo.save(message);
    }

    return chat;
  }

  // Chatga message qo‘shish
  async addMessage(dto: CreateMessageDto) {
    const chat = await this.chatRepo.findOne({ where: { id: dto.chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    const message = this.messageRepo.create({
      chat,
      senderId: dto.senderId,
      text: dto.text,
    });

    return this.messageRepo.save(message);
  }

  // Chatdagi barcha xabarlarni olish
  async getMessages(chatId: string) {
    return this.messageRepo.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' },
    });
  }

  // Xabarni o‘qilgan sifatida belgilash
  async markAsRead(messageId: string, userId: string) {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Message not found');

    if (message.senderId === userId)
      throw new Error('You cannot mark your own sent message as read');

    message.read = true;
    message.readAt = new Date();
    return this.messageRepo.save(message);
  }

  async getUserChats(userId: string) {
    return this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('chat.messages', 'message')
      .where('participant.id = :userId', { userId })
      .orderBy('chat.createdAt', 'DESC')
      .getMany();
  }

  async getChatById(chatId: string, userId: string) {
    const chat = await this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('chat.messages', 'message')
      .where('chat.id = :chatId', { chatId })
      .andWhere('participant.id = :userId', { userId })
      .orderBy('message.createdAt', 'ASC')
      .getOne();

    if (!chat) {
      throw new ForbiddenException('Siz bu chatga kira olmaysiz');
    }

    return chat;
  }

  async getChatMembers(chatId: string, userId: string) {
    const chat = await this.chatRepo
      .createQueryBuilder('chat')
      .leftJoin('chat.participants', 'participant')
      .addSelect(['participant.id', 'participant.full_name', 'participant.avatar']) // o'zingdagi field nomlari
      .where('chat.id = :chatId', { chatId })
      .andWhere('participant.id = :userId', { userId })
      .getOne();

    if (!chat) throw new ForbiddenException('Siz bu chatga kira olmaysiz');

    // participants listni alohida query bilan olib beramiz (toza select bilan)
    const members = await this.userRepo
      .createQueryBuilder('u')
      .innerJoin('u.chats', 'c', 'c.id = :chatId', { chatId })
      .select(['u.id', 'u.full_name', 'u.avatar'])
      .getMany();

    return { chatId, members, total: members.length };
  }
}
