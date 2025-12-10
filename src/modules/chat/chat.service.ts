import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "./entities/chat.entity";
import { CreateChatDto } from "./dto/create-chat.dto";

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
  ) {}

  async create(fromUserId: number, dto: CreateChatDto) {
    if (fromUserId === dto.toUserId)
      throw new Error("You cannot chat with yourself.");

    const chat = this.chatRepo.create({
      fromUserId,
      toUserId: dto.toUserId,
      text: dto.text,
    });

    return await this.chatRepo.save(chat);
  }

  async getConversation(user1: number, user2: number) {
    return await this.chatRepo.find({
      where: [
        { fromUserId: user1, toUserId: user2 },
        { fromUserId: user2, toUserId: user1 },
      ],
      order: { createdAt: "ASC" },
    });
  }

  async markAsRead(chatId: number, userId: number) {
    const chat = await this.chatRepo.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException("Chat message not found");

    if (chat.toUserId !== userId)
      throw new Error("You can read only your incoming messages");

    chat.read = true;
    return await this.chatRepo.save(chat);
  }
}
