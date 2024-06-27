import { NodeEnvironment } from '@app/common/types/common.type';
import { HttpModuleOptions } from '@nestjs/axios';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { Inject, Optional } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ClientProvider } from '@nestjs/microservices';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { Redis, RedisOptions } from 'ioredis';
import { memoryStorage } from 'multer';
import { apiConfig } from './configs/api.config';
import { authConfig } from './configs/auth.config';
import { batchConfig } from './configs/batch.config';
import { blobStorageConfig } from './configs/blobStorage.config';
import { commonConfig } from './configs/common.config';
import { cronTimeConfig } from './configs/cronTime.config';
import { databaseConfig } from './configs/database.config';
import { googleConfig } from './configs/google.config';
import { ifConfig } from './configs/if.config';
import { mailConfig } from './configs/mail.config';
import { redisConfig } from './configs/redis.config';

export class AppConfigService {
  constructor(
    @Optional()
    @Inject(commonConfig.KEY)
    private readonly commonCf: ConfigType<typeof commonConfig>,
    @Optional()
    @Inject(apiConfig.KEY)
    private readonly apiCf: ConfigType<typeof apiConfig>,
    @Optional()
    @Inject(databaseConfig.KEY)
    private readonly databaseCf: ConfigType<typeof databaseConfig>,
    @Optional()
    @Inject(authConfig.KEY)
    private readonly authCf: ConfigType<typeof authConfig>,
    @Optional()
    @Inject(redisConfig.KEY)
    private readonly redisCf: ConfigType<typeof redisConfig>,
    @Optional()
    @Inject(mailConfig.KEY)
    private readonly mailCf: ConfigType<typeof mailConfig>,
    @Optional()
    @Inject(batchConfig.KEY)
    private readonly batchCf: ConfigType<typeof batchConfig>,
    @Optional()
    @Inject(blobStorageConfig.KEY)
    private readonly blobStorageCf: ConfigType<typeof blobStorageConfig>,
    @Optional()
    @Inject(googleConfig.KEY)
    private readonly googleCf: ConfigType<typeof googleConfig>,
    @Optional()
    @Inject(cronTimeConfig.KEY)
    private readonly cronTimeCf: ConfigType<typeof cronTimeConfig>,
    @Optional()
    @Inject(ifConfig.KEY)
    private readonly ifCf: ConfigType<typeof ifConfig>,
  ) {}

  get commonConfig() {
    return this.commonCf;
  }

  get apiConfig() {
    return this.apiCf;
  }

  get databaseConfig() {
    return this.databaseCf;
  }

  get authConfig() {
    return this.authCf;
  }

  get redisConfig() {
    return this.redisCf;
  }

  get mailconfig() {
    return this.mailCf;
  }

  get batchconfig() {
    return this.batchCf;
  }

  get blobStorageConfig() {
    return this.blobStorageCf;
  }

  get googleConfig() {
    return this.googleCf;
  }

  get cronTimeConfig() {
    return this.cronTimeCf;
  }

  get ifConfig() {
    return this.ifCf;
  }

  get isDevEnv() {
    return this.commonCf.nodeEnv === NodeEnvironment.DEV;
  }

  get isTestEnv() {
    return this.commonCf.nodeEnv === NodeEnvironment.TEST;
  }

  get isQAEnv() {
    return this.commonCf.nodeEnv === NodeEnvironment.QA;
  }

  get isStagingEnv() {
    return this.commonCf.nodeEnv === NodeEnvironment.STAGING;
  }

  get isProdEnv() {
    return this.commonCf.nodeEnv === NodeEnvironment.PROD;
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: this.databaseCf.type as any,
      host: this.databaseCf.host,
      port: this.databaseCf.port,
      username: this.databaseCf.username,
      password: this.databaseCf.password,
      database: this.databaseCf.name,
      synchronize: this.databaseCf.synchronize,
      logging: this.databaseCf.logging,
      migrationsTableName: 'MIGRATIONS',
      migrationsTransactionMode: 'all',
    };
  }

  get jwtConfig(): JwtModuleOptions {
    return {
      privateKey: this.authCf.atPrivateKey,
      publicKey: this.authCf.atPublicKey,
      signOptions: {
        expiresIn: this.authCf.atExpire,
        algorithm: 'RS256',
        allowInsecureKeySizes: true,
      },
    };
  }

  get cacheRedisConfig(): CacheModuleOptions<RedisOptions> {
    return {
      store: redisStore,
      host: this.redisCf.host,
      port: this.redisCf.port,
    };
  }

  get throttlerConfig(): ThrottlerModuleOptions {
    return {
      storage: new Redis({
        host: this.redisCf.host,
        port: this.redisCf.port,
      }),
    };
  }

  get batchClientConfig(): ClientProvider {
    return {
      transport: this.batchCf.transport,
      options: {
        host: this.batchCf.host,
        port: this.batchCf.port,
      },
    };
  }

  get multerConfig(): MulterModuleOptions {
    return {
      storage: memoryStorage(),
    };
  }

  get httpGoogleConfig(): HttpModuleOptions {
    return {
      baseURL: this.googleCf.apiUrl,
      params: {
        key: this.googleCf.apiKey,
      },
    };
  }
}
