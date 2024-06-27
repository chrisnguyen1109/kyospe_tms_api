import { SessionEntity } from '@app/database/entities/session.entity';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [AuthController],
  providers: [AuthService, SessionRepository],
  exports: [AuthService],
})
export class AuthModule {}
