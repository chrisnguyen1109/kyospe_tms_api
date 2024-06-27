import { registerAs } from '@nestjs/config';
import { ApiConfigDto } from './dtos/apiConfig.dto';
import { validateConfig } from '@app/common/utils/validateConfig.util';

export const apiConfig = registerAs('api', () =>
  validateConfig(
    {
      apiPort: process.env['API_PORT'],
      apiPrefix: process.env['API_PREFIX'],
      apiVersion: process.env['API_VERSION'],
      version: process.env['VERSION'],
    },
    ApiConfigDto,
  ),
);
