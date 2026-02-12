import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  ParseUUIDPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha chatlarini olish' })
  @ApiResponse({ status: 200, description: 'Chatlar ro‘yxati' })
  getMyChats(@Req() req: any) {
    return this.service.getUserChats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta chat ma’lumotini olish' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chat ID',
  })
  @ApiResponse({ status: 200, description: 'Chat ma’lumoti' })
  getOneChat(
    @Param('id', ParseUUIDPipe) chatId: string,
    @Req() req: any,
  ) {
    return this.service.getChatById(chatId, req.user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Chat xabarlarini olish' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Chat ID',
  })
  @ApiResponse({ status: 200, description: 'Xabarlar ro‘yxati' })
  getMessages(@Param('id', ParseUUIDPipe) chatId: string) {
    return this.service.getMessages(chatId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Chat ishtirokchilarini olish' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chat ID (UUID)',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({ status: 200, description: 'Chat members ro‘yxati' })
  @ApiResponse({ status: 403, description: 'Siz bu chatga kira olmaysiz' })
  @ApiResponse({ status: 404, description: 'Chat topilmadi' })
  getMembers(@Param('id', ParseUUIDPipe) chatId: string, @Req() req: any) {
    return this.service.getChatMembers(chatId, req.user.id);
  }

  @Post('messages/:id/read')
  @ApiOperation({ summary: 'Xabarni o‘qilgan deb belgilash' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Message ID',
  })
  @ApiResponse({ status: 200, description: 'Xabar o‘qilgan deb belgilandi' })
  markAsRead(@Param('id', ParseUUIDPipe) messageId: string, @Req() req: any) {
    return this.service.markAsRead(messageId, req.user.id);
  }
}
