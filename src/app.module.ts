import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:".env", isGlobal:true}),
    SequelizeModule.forRoot({
      dialect:"postgres",
      host:process.env.PG_HOST,
      port:Number(process.env.PG_PORT),
      username:process.env.PG_USER,
      password:process.env.PG_PASSWORD,
      database:process.env.PG_DATABASE,
      models:[],
      autoLoadModels:true,
      sync:{force:false},
      logging:false
    }),
    UsersModule,
    AuthModule,
    ProfileModule,
    NotificationModule,
    ChatModule,
    PostModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
