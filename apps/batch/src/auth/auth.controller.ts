import { AppEventPattern } from '@app/common/types/common.type';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(AppEventPattern.Batch.REMOVE_SESSION)
  removeSession() {
    return this.authService.manualRemoveSession();
  }
}
