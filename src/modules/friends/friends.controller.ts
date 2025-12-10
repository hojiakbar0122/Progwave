import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  Delete,
  Patch,
} from "@nestjs/common";
import { FriendsService } from "./friends.service";

@Controller("friends")
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post("request/:toUserId")
  sendRequest(@Req() req, @Param("toUserId") toUserId: number) {
    return this.friendsService.sendRequest(req.user.id, toUserId);
  }

  @Post("accept/:requestId")
  accept(@Req() req, @Param("requestId") requestId: number) {
    return this.friendsService.acceptRequest(requestId, req.user.id);
  }

  @Post("reject/:requestId")
  reject(@Req() req, @Param("requestId") requestId: number) {
    return this.friendsService.rejectRequest(requestId, req.user.id);
  }

  @Post("cancel/:requestId")
  cancel(@Req() req, @Param("requestId") requestId: number) {
    return this.friendsService.cancelRequest(requestId, req.user.id);
  }

  @Get("list")
  getFriends(@Req() req) {
    return this.friendsService.getFriends(req.user.id);
  }

  @Get("requests")
  getPending(@Req() req) {
    return this.friendsService.getPendingRequests(req.user.id);
  }
}
