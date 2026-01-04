import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataSource } from 'typeorm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/src/**/*.entity{.ts,.js}`],
  synchronize: false,
  logging: false,
  migrations: [`${__dirname}/src/db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  extra: {
    options: '-c timezone=Asia/Tashkent',
  },
});
