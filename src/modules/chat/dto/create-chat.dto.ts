import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'Chat ishtirokchilari IDlari',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  participantIds: string[];

  @ApiPropertyOptional({
    description:
      'Agar chat yaratilganda birinchi xabar bo‘lsa, yuboruvchi IDsi',
    example: 1,
  })
  @IsOptional()
  @IsInt()
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
