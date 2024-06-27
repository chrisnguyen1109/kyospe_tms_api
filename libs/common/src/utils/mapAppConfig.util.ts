import { apiConfig } from '@app/app-config/configs/api.config';
import { authConfig } from '@app/app-config/configs/auth.config';
import { batchConfig } from '@app/app-config/configs/batch.config';
import { blobStorageConfig } from '@app/app-config/configs/blobStorage.config';
import { commonConfig } from '@app/app-config/configs/common.config';
import { cronTimeConfig } from '@app/app-config/configs/cronTime.config';
import { databaseConfig } from '@app/app-config/configs/database.config';
import { googleConfig } from '@app/app-config/configs/google.config';
import { ifConfig } from '@app/app-config/configs/if.config';
import { mailConfig } from '@app/app-config/configs/mail.config';
import { redisConfig } from '@app/app-config/configs/redis.config';
import { ConfigFactory } from '@nestjs/config';
import { AppConfig } from '../types/common.type';

export const mapAppConfig = (appConfigs: AppConfig[]): ConfigFactory[] => {
  const appConfigArr = [
    {
      provider: AppConfig.COMMON_CONFIG,
      value: commonConfig,
    },
    {
      provider: AppConfig.API_CONFIG,
      value: apiConfig,
    },
    {
      provider: AppConfig.DATABASE_CONFIG,
      value: databaseConfig,
    },
    {
      provider: AppConfig.AUTH_CONFIG,
      value: authConfig,
    },
    {
      provider: AppConfig.REDIS_CONFIG,
      value: redisConfig,
    },
    {
      provider: AppConfig.MAIL_CONFIG,
      value: mailConfig,
    },
    {
      provider: AppConfig.BATCH_CONFIG,
      value: batchConfig,
    },
    {
      provider: AppConfig.BLOB_STORAGE_CONFIG,
      value: blobStorageConfig,
    },
    {
      provider: AppConfig.GOOGLE_CONFIG,
      value: googleConfig,
    },
    {
      provider: AppConfig.CRON_TIME_CONFIG,
      value: cronTimeConfig,
    },
    {
      provider: AppConfig.IF_CONFIG,
      value: ifConfig,
    },
  ];

  return appConfigArr
    .filter(appCf => appConfigs.includes(appCf.provider))
    .map(appCf => appCf.value);
};
