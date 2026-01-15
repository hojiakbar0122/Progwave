import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class CreateStoryDto {
  @ApiProperty({
    description: 'Story media URL',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  @IsNotEmpty()
  mediaUrl: string;

  @ApiProperty({
    description: 'Media ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  mediaId: string;

  @ApiPropertyOptional({ description: 'Media turi', enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;
}
