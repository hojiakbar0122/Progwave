import { IsNumber, IsString, IsOptional, IsBoolean } from "class-validator";

// Yangi notification yaratish
export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  type: string;

  @IsOptional()
  payload?: any;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}

// Notification update (masalan, read qilish)
export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}

// Notification list yoki filter olish
export class GetNotificationsDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
