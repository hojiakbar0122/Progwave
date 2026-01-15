import { IsInt, IsNotEmpty, IsEnum, IsString } from 'class-validator';

export class RespondFriendRequestDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsEnum(['accept', 'reject'])
  action: 'accept' | 'reject';
}
