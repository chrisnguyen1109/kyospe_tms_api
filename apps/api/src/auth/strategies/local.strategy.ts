import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { StrategyName } from '../auth.type';
import {
  USERNAME_CREDENTIAL,
  PASSWORD_CREDENTIAL,
} from '@app/common/types/constant.type';

@Injectable()
export class LocalStategy extends PassportStrategy(
  Strategy,
  StrategyName.LOCAL,
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: USERNAME_CREDENTIAL,
      passwordField: PASSWORD_CREDENTIAL,
    });
  }

  validate(loginId: string, password: string) {
    return this.authService.validateUser(loginId, password);
  }
}
