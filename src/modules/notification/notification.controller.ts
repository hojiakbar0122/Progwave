import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Req,
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

import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
} from './dto/create-notification.dto';
import { ACCESS_TOKEN_USER } from '../auth/passport-stratagies/access-token-user/access-token-user.strategy';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard(ACCESS_TOKEN_USER))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Notification yaratish' })
  @ApiResponse({ status: 201, description: 'Notification yaratildi' })
  create(@Req() req: any, @Body() dto: CreateNotificationDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchi notificationlarini olish' })
  @ApiResponse({ status: 200, description: 'Notificationlar ro‘yxati' })
  findAll(@Req() req: any, @Query() query: GetNotificationsDto) {
    return this.service.findAll(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta notification olish' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Notification ID',
  })
  @ApiResponse({ status: 200, description: 'Notification topildi' })
  findOne(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Notification yangilash (masalan, read qilish)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Notification ID',
  })
  @ApiResponse({ status: 200, description: 'Notification yangilandi' })
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Notification o‘chirish' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Notification ID',
  })
  @ApiResponse({ status: 200, description: 'Notification o‘chirildi' })
  remove(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(req.user.id, id);
  }
}
