import { AppConfigService } from '@app/app-config/appConfig.service';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpGoogleConfigService implements HttpModuleOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return this.appConfigService.httpGoogleConfig;
  }
}
