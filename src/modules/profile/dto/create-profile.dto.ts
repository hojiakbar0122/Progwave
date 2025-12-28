import {
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateProfileDto {
  @ApiPropertyOptional({
    description: 'Foydalanuvchi to‘liq ismi',
    example: 'Hojiakbar Ibragimov',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Bio / qisqacha tavsif',
    example: 'NestJS developer',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Veb-sayt URL',
    example: 'https://example.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Avatar rasmi URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Cover rasmi URL',
    example: 'https://example.com/cover.jpg',
  })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Jins', enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Tug‘ilgan sana', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({
    description: 'Ko‘nikmalar ro‘yxati',
    example: ['NestJS', 'TypeScript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
