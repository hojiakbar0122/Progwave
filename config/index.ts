import * as dotenv from 'dotenv';
import { IConfig } from './config.interface';

dotenv.config();

function ensureEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export default (): IConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  database: {
    host: ensureEnv('DB_HOST'),
    type: process.env.DB_TYPE || 'postgres',
    name: 'default',
    subscribers: [],
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: ensureEnv('DB_USERNAME'),
    password: ensureEnv('DB_PASSWORD'),
    database: ensureEnv('DB_NAME'),
    logging: false,
    autoLoadEntities: true,
    entities: ['./dist/**/*.entity.js'],
    synchronize: true,
    migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
    migrationsTableName: 'migration',
    extra: {
      options: '-c timezone=Asia/Tashkent',
    },
  },

  jwt: {
    accessTokenSecret: ensureEnv('JWT_ACCESS_TOKEN_SECRET'),
    accessTokenExpiration: ensureEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    refreshTokenSecret: ensureEnv('JWT_REFRESH_TOKEN_SECRET'),
    refreshTokenExpiration: ensureEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
  },

  newPasswordBytes: 4,
  codeBytes: 2,
});
