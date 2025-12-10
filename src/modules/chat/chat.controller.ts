import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from "@nestjs/common";
import { ChatsService } from "./chat.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateChatDto } from "./dto/create-chat.dto";

@Controller("chats")
@UseGuards(RolesGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateChatDto) {
    return this.chatsService.create(req.user.id, dto);
  }

  @Get(":userId")
  getConversation(@Req() req, @Param("userId", ParseIntPipe) otherUserId: number) {
    return this.chatsService.getConversation(req.user.id, otherUserId);
  }

  @Patch("read/:id")
  markAsRead(@Req() req, @Param("id", ParseIntPipe) id: number) {
    return this.chatsService.markAsRead(id, req.user.id);
  }
}
