import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import Redis from 'ioredis';
import { UserService } from '../users/users.service';
import { ensureEnv } from 'src/shared/helpers/ensureEnv';
import { CreateUserDto } from '../users/dto';
import { User } from '../users/entities/user.entity';
import { where } from 'sequelize';
@Injectable()
export class AuthService {
  private redis: Redis;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: ensureEnv('REDIS_HOST'),
      port: parseInt(ensureEnv('REDIS_PORT'), 10),
      password: process.env.REDIS_PASSWORD || undefined, // bo‘sh bo‘lsa yubormaydi
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    });
  }
  async validateUserByEmailPassword(login: string, password: string) {
    const user = await this.userService.getByLogin(login);
    console.log('user-->', user);

    if (!user) {
      throw new BadRequestException('Invalid login.');
    }

    const isPasswordSame = await this.comparePasswordWithHash(
      password,
      user.password,
    );

    if (!isPasswordSame) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async sendVerificationEmail(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Redisga kodni 5 daqiqaga saqlaymiz
    await this.redis.set(`verify:${email}`, code, 'EX', 300);

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email verification</h2>
        <p>Your code is: <strong>${code}</strong></p>
      </div>
    `;

    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'UzChamp <noreply@uzchamp.uz>',
        to: email,
        subject: 'Your Verification Code',
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return { message: 'Kod yuborildi', email };
  }

  async verifyEmailCode(email: string, code: string) {
    const storedCode = await this.redis.get(`verify:${email}`);

    if (!storedCode || storedCode !== code) {
      throw new BadRequestException('Kod noto‘g‘ri yoki muddati o‘tgan');
    }

    await this.redis.del(`verify:${email}`);
    return { message: 'Email tasdiqlandi' };
  }

  async validateUserById(userId: number) {
    const user = await this.userService.getOne(userId).catch(() => {
      throw new BadRequestException('Valid token with non-existent user.');
    });
    return user;
  }

  async comparePasswordWithHash(password: string, hash: string) {
    const isSame = await bcrypt.compare(password, hash);
    return isSame;
  }

  getJWT(type: 'access' | 'refresh', sub: number) {
    const payload = { sub };

    if (type === 'access') {
      return this.jwtService.sign(payload);
    }

    const jwtConfig = this.configService.getOrThrow('jwt');
    return this.jwtService.sign(payload, {
      secret: jwtConfig.refreshTokenSecret,
      expiresIn: jwtConfig.refreshTokenExpiration,
    });
  }

  async isValidUser(id: number): Promise<boolean> {
    const user = await this.userService.getOne(id);
    return !!user?.isActive;
  }
  async register(dto: CreateUserDto): Promise<User> {
    const user = await this.userService.register(dto);
    return user;
  }
}
