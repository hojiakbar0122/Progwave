import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from './create-notification.dto';

export class GetNotificationsDto {
  @ApiPropertyOptional({
    enum: NotificationType,
    description: 'Notification turi bo‘yicha filter',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    description: 'O‘qilgan / o‘qilmagan',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
