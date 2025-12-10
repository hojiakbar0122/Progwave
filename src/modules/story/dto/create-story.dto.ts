import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateStoryDto {
  @IsString()
  mediaUrl: string;

  @IsBoolean()
  @IsOptional()
  isVideo?: boolean = false;
}
