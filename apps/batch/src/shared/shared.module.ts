import { AppConfigModule } from '@app/app-config/appConfig.module';
import { AsyncLockService } from '@app/common/services/asyncLock.service';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import { AppConfig } from '@app/common/types/common.type';
import { DatabaseModule } from '@app/database/database.module';
import { GoogleModule } from '@app/google/google.module';
import { CustomI18nModule } from '@app/i18n/i18n.module';
import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    AppConfigModule.forRoot({
      inject: [
        AppConfig.COMMON_CONFIG,
        AppConfig.DATABASE_CONFIG,
        AppConfig.BLOB_STORAGE_CONFIG,
        AppConfig.CRON_TIME_CONFIG,
        AppConfig.GOOGLE_CONFIG,
        AppConfig.IF_CONFIG,
      ],
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    CustomI18nModule.init(),
    GoogleModule,
  ],
  providers: [AsyncLockService, BlobStorageService],
  exports: [
    AppConfigModule,
    DatabaseModule,
    ScheduleModule,
    AsyncLockService,
    CustomI18nModule,
    BlobStorageService,
    GoogleModule,
  ],
})
export class SharedModule {}
