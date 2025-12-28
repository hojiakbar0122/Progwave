import { IsNumber, IsOptional } from 'class-validator';

export class GetFriendRequestsDto {
  @IsOptional()
  @IsNumber()
  userId?: string; // sent yoki received bo'yicha filterlash uchun
}
