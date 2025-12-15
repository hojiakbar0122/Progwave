import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Notification o‘qilganligini belgilash',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
