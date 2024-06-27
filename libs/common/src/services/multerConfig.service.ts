import { AppConfigService } from '@app/app-config/appConfig.service';
import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return this.appConfigService.multerConfig;
  }
}
