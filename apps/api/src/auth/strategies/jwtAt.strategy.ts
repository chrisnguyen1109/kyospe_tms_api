import { AppConfigService } from '@app/app-config/appConfig.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyName } from '../auth.type';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { Request } from 'express';

@Injectable()
export class JwtAccesstokenStrategy extends PassportStrategy(
  Strategy,
  StrategyName.JWT_AT,
) {
  constructor(private readonly appConfigService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigService.authConfig.atPublicKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: LoginUserDto & { sessionId: string }) {
    req.sessionId = payload.sessionId;

    return payload;
  }
}
