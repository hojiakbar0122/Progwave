import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from '../message/dto/create-message.dto';

@ApiTags('Chats')
@ApiBearerAuth()
@Controller('chats')
@UseGuards(AuthGuard('access_token_user'))
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi chat yaratish' })
  @ApiResponse({ status: 201, description: 'Chat muvaffaqiyatli yaratildi' })
  create(@Req() req: any, @Body() dto: CreateChatDto) {
    // user chat ishtirokchisi bo‘lishi shart
    if (!dto.participantIds.includes(req.user.id)) {
      dto.participantIds.push(req.user.id);
    }

    dto.initialMessageSenderId = req.user.id;

    return this.service.createChat(dto);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Chatga yangi xabar yuborish' })
  @ApiResponse({ status: 201, description: 'Xabar yuborildi' })
  addMessage(@Req() req: any, @Body() dto: CreateMessageDto) {
    dto.senderId = req.user.id;
    return this.service.addMessage(dto);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Chat xabarlarini olish' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chat ID',
  })
  @ApiResponse({ status: 200, description: 'Xabarlar ro‘yxati' })
  getMessages(@Param('id', ParseIntPipe) chatId: number) {
    return this.service.getMessages(chatId);
  }

  @Post('messages/:id/read')
  @ApiOperation({ summary: 'Xabarni o‘qilgan deb belgilash' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Message ID',
  })
  @ApiResponse({ status: 200, description: 'Xabar o‘qilgan deb belgilandi' })
  markAsRead(
    @Param('id', ParseIntPipe) messageId: number,
    @Req() req: any,
  ) {
    return this.service.markAsRead(messageId, req.user.id);
  }
}
