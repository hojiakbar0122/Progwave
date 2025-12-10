import { IsEnum } from "class-validator";
import type { FriendRequestStatus } from "../entities/friend-request.entity";

export class UpdateFriendRequestDto {
  @IsEnum(["pending", "accepted", "rejected", "cancelled"])
  status: FriendRequestStatus;
}