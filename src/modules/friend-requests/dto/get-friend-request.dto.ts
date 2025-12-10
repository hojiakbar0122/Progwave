import { IsNumber, IsOptional } from "class-validator";

export class GetFriendRequestsDto {
  @IsOptional()
  @IsNumber()
  userId?: number; // sent yoki received bo'yicha filterlash uchun
}