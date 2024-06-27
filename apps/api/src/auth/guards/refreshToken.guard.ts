import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../auth.type';

export class RefreshTokenGuard extends AuthGuard(StrategyName.JWT_RT) {
  constructor() {
    super();
  }
}
