import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  chatId: string;

  @IsOptional()
  @IsInt()
  senderId?: string;

  @IsString()
  text: string;
}
