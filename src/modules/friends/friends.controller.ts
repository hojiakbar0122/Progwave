
import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { FriendsService } from './friends.service';
import { ACCESS_TOKEN_USER } from '../auth/passport-stratagies/access-token-user/access-token-user.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Friends')
@ApiBearerAuth()
@Controller('friends')
@UseGuards(RolesGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post('request/:toUserId')
  @ApiOperation({ summary: 'Do‘stlik so‘rovi yuborish' })
  @ApiParam({
    name: 'toUserId',
    type: Number,
    description: 'So‘rov yuboriladigan foydalanuvchi IDsi',
  })
  @ApiResponse({ status: 201, description: 'Do‘stlik so‘rovi yuborildi' })
  sendRequest(
    @Req() req: any,
    @Param('toUserId', ParseIntPipe) toUserId: number,
  ) {
    return this.friendsService.sendRequest(req.user.id, toUserId);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post('accept/:requestId')
  @ApiOperation({ summary: 'Do‘stlik so‘rovini qabul qilish' })
  @ApiParam({
    name: 'requestId',
    type: Number,
    description: 'Friend request ID',
  })
  @ApiResponse({ status: 200, description: 'So‘rov qabul qilindi' })
  accept(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.friendsService.acceptRequest(requestId, req.user.id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post('reject/:requestId')
  @ApiOperation({ summary: 'Do‘stlik so‘rovini rad etish' })
  @ApiParam({
    name: 'requestId',
    type: Number,
    description: 'Friend request ID',
  })
  @ApiResponse({ status: 200, description: 'So‘rov rad etildi' })
  reject(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.friendsService.rejectRequest(requestId, req.user.id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Post('cancel/:requestId')
  @ApiOperation({ summary: 'Yuborilgan do‘stlik so‘rovini bekor qilish' })
  @ApiParam({
    name: 'requestId',
    type: Number,
    description: 'Friend request ID',
  })
  @ApiResponse({ status: 200, description: 'So‘rov bekor qilindi' })
  cancel(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.friendsService.cancelRequest(requestId, req.user.id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Get('list')
  @ApiOperation({ summary: 'Do‘stlar ro‘yxatini olish' })
  @ApiResponse({ status: 200, description: 'Do‘stlar ro‘yxati' })
  getFriends(@Req() req: any) {
    return this.friendsService.getFriends(req.user.id);
  }

  @UseGuards(AuthGuard(ACCESS_TOKEN_USER))
  @Get('requests')
  @ApiOperation({ summary: 'Kutilayotgan do‘stlik so‘rovlarini olish' })
  @ApiResponse({ status: 200, description: 'Pending so‘rovlar ro‘yxati' })
  getPending(@Req() req: any) {
    return this.friendsService.getPendingRequests(req.user.id);
  }
}
