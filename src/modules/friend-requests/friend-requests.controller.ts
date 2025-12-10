import { Controller, Post, Body, Patch, Param, Get, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { FriendRequestService } from "./friend-requests.service";
import { CreateFriendRequestDto, UpdateFriendRequestDto, GetFriendRequestsDto } from "./dto/index";

@Controller("friend-requests")
export class FriendRequestController {
  constructor(private readonly service: FriendRequestService) {}

  @Post()
  create(@Body() dto: CreateFriendRequestDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  updateStatus(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateFriendRequestDto) {
    return this.service.updateStatus(id, dto);
  }

  @Get()
  findAll(@Query() query: GetFriendRequestsDto) {
    return this.service.findAll(query.userId);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
