import { registerAs } from '@nestjs/config';
import { validateConfig } from '@app/common/utils/validateConfig.util';
import { BatchConfigDto } from './dtos/batchConfig.dto';

export const batchConfig = registerAs('batch', () =>
  validateConfig(
    {
      host: process.env['BATCH_HOST'],
      port: process.env['BATCH_PORT'],
    },
    BatchConfigDto,
  ),
);
