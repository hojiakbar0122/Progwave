import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsObject,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
}

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Notification turi',
    example: NotificationType.FRIEND_REQUEST,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({
    description: 'Qo‘shimcha ma’lumot (JSON)',
    example: { requestId: 12 },
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'O‘qilgan yoki o‘qilmaganligi',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
