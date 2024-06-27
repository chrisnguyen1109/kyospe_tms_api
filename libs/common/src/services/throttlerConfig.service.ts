import { AppConfigService } from '@app/app-config/appConfig.service';
import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return this.appConfigService.throttlerConfig;
  }
}
