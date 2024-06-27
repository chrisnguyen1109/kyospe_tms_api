import { validateConfig } from '@app/common/utils/validateConfig.util';
import { registerAs } from '@nestjs/config';
import { BlobStorageConfigDto } from './dtos/blobStorageConfig.dto';

export const blobStorageConfig = registerAs('blobStorage', () =>
  validateConfig(
    {
      accountName: process.env['ACCOUNT_NAME'],
      accountKey: process.env['ACCOUNT_KEY'],
      containerName: process.env['CONTAINER_NAME'],
    },
    BlobStorageConfigDto,
  ),
);
