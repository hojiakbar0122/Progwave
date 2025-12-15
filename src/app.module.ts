import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PositionModule } from './modules/position/position.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/users/users.module';
import { FriendsModule } from './modules/friends/friends.module';
import { FriendRequestsModule } from './modules/friend-requests/friend-requests.module';
import { StoryModule } from './modules/story/story.module';
import { MessageModule } from './modules/message/message.module';
import configuration from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',  // yoki config.get<string>('DB_TYPE') agar env’dan o‘qimoqchi bo‘lsangiz
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
    }),

    AuthModule,
    UserModule,
    PositionModule,
    NotificationModule,
    ProfileModule,
    ChatModule,
    PostModule,
    FriendsModule,
    FriendRequestsModule,
    StoryModule,
    MessageModule,
  ],
})
export class AppModule {}
