import { AppConfigService } from '@app/app-config/appConfig.service';
import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return this.appConfigService.jwtConfig;
  }
}
