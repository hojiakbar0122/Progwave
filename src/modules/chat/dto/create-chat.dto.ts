import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UUID } from 'sequelize';

export class CreateChatDto {
  @ApiProperty({
    description: 'Chat ishtirokchilari IDlari',
    example: [UUID()],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantIds: string[];

  @ApiPropertyOptional({
    description:
      'Agar chat yaratilganda birinchi xabar bo‘lsa, yuboruvchi IDsi',
    example: 1,
  })
  @IsOptional()
  @IsString()
  initialMessageSenderId?: string;

  @ApiPropertyOptional({
    description: 'Chat yaratilganda yuboriladigan dastlabki xabar matni',
    example: 'Assalomu alaykum',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}
