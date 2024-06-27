import { validateConfig } from '@app/common/utils/validateConfig.util';
import { registerAs } from '@nestjs/config';
import { IfConfigDto } from './dtos/ifConfig.dto';

export const ifConfig = registerAs('if', () =>
  validateConfig(
    {
      limitRecord: process.env['IF_LIMIT_RECORD'],
    },
    IfConfigDto,
  ),
);
