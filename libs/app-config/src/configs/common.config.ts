import { validateConfig } from '@app/common/utils/validateConfig.util';
import { registerAs } from '@nestjs/config';
import { CommonConfigDto } from './dtos/commonConfig.dto';

export const commonConfig = registerAs('common', () =>
  validateConfig(
    {
      nodeEnv: process.env['NODE_ENV'],
      appUrl: process.env['APP_URL'],
      language: process.env['LANGUAGE'],
    },
    CommonConfigDto,
  ),
);
