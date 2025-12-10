import { IsInt, IsNotEmpty, IsEnum } from "class-validator";

export class RespondFriendRequestDto {
  @IsInt()
  @IsNotEmpty()
  requestId: number;

  @IsEnum(["accept", "reject"])
  action: "accept" | "reject";
}
