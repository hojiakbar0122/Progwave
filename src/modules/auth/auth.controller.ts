import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { CookieOptions, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './passport-stratagies/local/local-auth.guard';
import { ACCESS_TOKEN_USER } from './passport-stratagies/access-token-user/access-token-user.strategy';
import { RefreshTokenUserGuard } from './passport-stratagies/refresh-token-user/refresh-token-user.guard';
import { REFRESH_TOKEN_USER } from './passport-stratagies/refresh-token-user/refresh-token-user.strategy';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto';

const accessTokenOptions: CookieOptions = {
  secure: true,
  sameSite: 'none',
  maxAge: 31536000000,
};
const refreshTokenOptions: CookieOptions = {
  ...accessTokenOptions,
  httpOnly: true,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async login(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) response: Response,
    @Body() _: LoginDto,
  ) {
    if (!(await this.authService.isValidUser(user.id))) {
      response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
      response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
      throw new UnauthorizedException();
    }
    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);
    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);
    return { accessToken, refreshToken, user };
  }

  @Public()
  @Post('/logout')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'The user was logged out successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
    response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
  }

  @Public()
  @UseGuards(RefreshTokenUserGuard)
  @Post('/refresh')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async refresh(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!(await this.authService.isValidUser(user.id))) {
      response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
      response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
      throw new UnauthorizedException();
    }
    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);
    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);

    return { accessToken, refreshToken, user };
  }

  @Post('send-code')
  @ApiQuery({ name: 'email', type: String })
  sendCode(@Query('email') email: string) {
    return this.authService.sendVerificationEmail(email);
  }

  @Post('verify-code')
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiQuery({ name: 'code', type: String, required: true })
  verifyCode(@Query('email') email: string, @Query('code') code: string) {
    if (!email || !code) {
      throw new BadRequestException('Email va kod talab qilinadi');
    }
    return this.authService.verifyEmailCode(email, code);
  }

  @Public()
  @Post('/register')
  @HttpCode(201)
  @ApiNoContentResponse({
    description: 'User successfully registered and logged in',
  })
  @ApiBadRequestResponse({ description: 'Validation or registration error' })
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(dto);

    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);

    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);

    return { accessToken, refreshToken, user };
  }
}
