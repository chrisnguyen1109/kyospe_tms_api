import { AppConfigService } from '@app/app-config/appConfig.service';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory<RedisOptions> {
  constructor(private readonly appConfigService: AppConfigService) {}

  createCacheOptions(): CacheModuleOptions<RedisOptions> {
    return this.appConfigService.cacheRedisConfig;
  }
}
