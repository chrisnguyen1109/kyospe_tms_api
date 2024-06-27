import { AuthModule } from '@api/auth/auth.module';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { SessionEntity } from '@app/database/entities/session.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { MUserSubscriber } from '@app/database/subscribers/mUser.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MUserEntity,
      MBaseEntity,
      SessionEntity,
      MTransportCompanyEntity,
      MDriverEntity,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    MUserRepository,
    MUserSubscriber,
    MBaseRepository,
    SessionRepository,
    MTransportCompanyRepository,
    MDriverRepository,
  ],
})
export class UserModule {}
