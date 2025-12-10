import { IsNumber } from "class-validator";

export class CreateFriendRequestDto {
  @IsNumber()
  fromUserId: number;

  @IsNumber()
  toUserId: number;
}