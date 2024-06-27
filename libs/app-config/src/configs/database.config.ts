import { registerAs } from '@nestjs/config';
import { DatabaseConfigDto } from './dtos/databaseConfig.dto';
import { validateConfig } from '@app/common/utils/validateConfig.util';

export const databaseConfig = registerAs('database', () =>
  validateConfig(
    {
      type: process.env['DATABASE_TYPE'],
      host: process.env['DATABASE_HOST'],
      port: process.env['DATABASE_PORT'],
      username: process.env['DATABASE_USERNAME'],
      password: process.env['DATABASE_PASSWORD'],
      name: process.env['DATABASE_NAME'],
      synchronize: process.env['DATABASE_SYNC'],
      logging: process.env['DATABASE_LOGGING'],
    },
    DatabaseConfigDto,
  ),
);
