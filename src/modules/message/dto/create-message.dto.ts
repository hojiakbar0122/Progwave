import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsInt()
  chatId: number;

  @IsOptional()
  @IsInt()
  senderId?: number;

  @IsString()
  text: string;
}
