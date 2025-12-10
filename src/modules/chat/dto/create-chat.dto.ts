import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateChatDto {
  @IsNumber()
  toUserId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
