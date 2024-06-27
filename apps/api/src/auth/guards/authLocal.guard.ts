import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../auth.type';

export class AuthLocalGuard extends AuthGuard(StrategyName.LOCAL) {
  constructor() {
    super();
  }
}
