import { IsNumber } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNumber()
  fromUserId: string;

  @IsNumber()
  toUserId: string;
}
