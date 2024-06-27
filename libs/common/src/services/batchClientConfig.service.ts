import { AppConfigService } from '@app/app-config/appConfig.service';
import { Injectable } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
} from '@nestjs/microservices';

@Injectable()
export class BatchClientConfigService implements ClientsModuleOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createClientOptions(): ClientProvider {
    return this.appConfigService.batchClientConfig;
  }
}
