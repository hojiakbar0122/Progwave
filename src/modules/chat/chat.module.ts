import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { Message } from '../message/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
