import { Module, forwardRef } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from '../friend-requests/entities/friend-request.entity';
import { Friend } from './entities/friend.entity';
import { User } from '../users/entities/user.entity';
import { FriendsGateway } from './friends.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, Friend, User])],
  providers: [FriendsService, FriendsGateway],
  controllers: [FriendsController],
  exports: [FriendsService, forwardRef(() => FriendsGateway)],
})
export class FriendsModule {}
