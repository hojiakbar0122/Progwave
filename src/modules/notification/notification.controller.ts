import { Controller, Post, Get, Patch, Delete, Param, Body, Query, ParseIntPipe } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto, UpdateNotificationDto, GetNotificationsDto } from "./dto/create-notification.dto";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: GetNotificationsDto) {
    return this.service.findAll(query.userId, query.read);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateNotificationDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
