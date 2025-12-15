import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ACCESS_TOKEN_USER } from '../auth/passport-stratagies/access-token-user/access-token-user.strategy';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(AuthGuard(ACCESS_TOKEN_USER))
@Controller('profiles')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Foydalanuvchi profili yaratish' })
  @ApiResponse({ status: 201, description: 'Profile yaratildi' })
  create(@Req() req: any, @Body() dto: CreateProfileDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'O‘z profilingizni olish' })
  @ApiResponse({ status: 200, description: 'Profil topildi' })
  findOne(@Req() req: any) {
    return this.service.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'O‘z profilingizni yangilash' })
  @ApiResponse({ status: 200, description: 'Profil yangilandi' })
  update(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.service.update(req.user.id, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'O‘z profilingizni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Profil o‘chirildi' })
  remove(@Req() req: any) {
    return this.service.remove(req.user.id);
  }
}
