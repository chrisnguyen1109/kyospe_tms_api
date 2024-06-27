import { registerAs } from '@nestjs/config';
import { RedisConfigDto } from './dtos/redisConfig.dto';
import { validateConfig } from '@app/common/utils/validateConfig.util';

export const redisConfig = registerAs('redis', () =>
  validateConfig(
    {
      host: process.env['REDIS_HOST'],
      port: process.env['REDIS_PORT'],
    },
    RedisConfigDto,
  ),
);
