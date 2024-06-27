import { AppConfigService } from '@app/app-config/appConfig.service';
import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class TestGuard implements CanActivate {
  constructor(private readonly appConfigService: AppConfigService) {}

  canActivate(): boolean {
    if (this.appConfigService.isProdEnv) return false;

    return true;
  }
}
