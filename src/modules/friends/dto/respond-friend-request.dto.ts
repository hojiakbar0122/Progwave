import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export class RespondFriendRequestDto {
  @IsInt()
  @IsNotEmpty()
  requestId: string;

  @IsEnum(['accept', 'reject'])
  action: 'accept' | 'reject';
}
