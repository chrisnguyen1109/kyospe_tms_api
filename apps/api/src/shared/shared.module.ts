import { AppConfigModule } from '@app/app-config/appConfig.module';
import { BatchClientConfigService } from '@app/common/services/batchClientConfig.service';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import { CustomClsService } from '@app/common/services/customCls.service';
import { EventEmitterService } from '@app/common/services/eventEmitter.service';
import { JwtConfigService } from '@app/common/services/jwtConfig.service';
import { MailerService } from '@app/common/services/mailer.service';
import { MulterConfigService } from '@app/common/services/multerConfig.service';
import { AppConfig, AppService } from '@app/common/types/common.type';
import { DatabaseModule } from '@app/database/database.module';
import { GoogleModule } from '@app/google/google.module';
import { CustomI18nModule } from '@app/i18n/i18n.module';
import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule, ClsService } from 'nestjs-cls';

@Global()
@Module({
  imports: [
    AppConfigModule.forRoot({
      inject: [
        AppConfig.COMMON_CONFIG,
        AppConfig.API_CONFIG,
        AppConfig.DATABASE_CONFIG,
        AppConfig.BATCH_CONFIG,
        AppConfig.AUTH_CONFIG,
        AppConfig.MAIL_CONFIG,
        AppConfig.BLOB_STORAGE_CONFIG,
        AppConfig.GOOGLE_CONFIG,
      ],
    }),
    DatabaseModule,
    ClientsModule.registerAsync([
      { name: AppService.BATCH_SERVICE, useClass: BatchClientConfigService },
    ]),
    CustomI18nModule.init(),
    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    ThrottlerModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    GoogleModule,
  ],
  providers: [
    {
      provide: CustomClsService,
      useExisting: ClsService,
    },
    EventEmitterService,
    BlobStorageService,
    MailerService,
  ],
  exports: [
    AppConfigModule,
    DatabaseModule,
    ClientsModule,
    CustomI18nModule,
    ClsModule,
    CustomClsService,
    JwtModule,
    EventEmitterModule,
    EventEmitterService,
    BlobStorageService,
    MulterModule,
    GoogleModule,
    MailerService,
  ],
})
export class SharedModule {}
