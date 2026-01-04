import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-requests.service';
import { FriendRequestController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, User])],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestsModule {}
