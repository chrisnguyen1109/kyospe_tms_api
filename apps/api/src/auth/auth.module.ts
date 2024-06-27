import { MUserEntity } from '@app/database/entities/mUser.entity';
import { SessionEntity } from '@app/database/entities/session.entity';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { SessionSubscriber } from '@app/database/subscribers/session.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAbilityFactory } from './casl/userAbility.factory';
import { JwtAccesstokenStrategy } from './strategies/jwtAt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwtRt.strategy';
import { LocalStategy } from './strategies/local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([MUserEntity, SessionEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStategy,
    JwtAccesstokenStrategy,
    JwtRefreshTokenStrategy,
    MUserRepository,
    SessionRepository,
    UserAbilityFactory,
    SessionSubscriber,
  ],
  exports: [AuthService, UserAbilityFactory],
})
export class AuthModule {}
