import { AppConfigService } from '@app/app-config/appConfig.service';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { COM_CER001_001Exception } from '@app/common/filters/exceptions/COM_CER001_001.exception';
import { COM_CER001_003Exception } from '@app/common/filters/exceptions/COM_CER001_003.exception';
import { COM_CER002_001Exception } from '@app/common/filters/exceptions/COM_CER002_001.exception';
import { BaseMail } from '@app/common/utils/baseMail.util';
import { generatePassword } from '@app/common/utils/generatePassword.util';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { MailerService } from '@app/common/services/mailer.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { randomUUID } from 'node:crypto';
import { RefreshTokenPayload } from './auth.type';
import { ForgotPasswordBodyDto } from './dtos/forgotPasswordBody.dto';
import { AppEventPattern, AppService } from '@app/common/types/common.type';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AppService.BATCH_SERVICE) private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly mailerService: MailerService,

    private readonly mUserRepository: MUserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async validateUser(loginId: string, password: string) {
    const user = await this.mUserRepository.findOneBy({
      userId: loginId.trim(),
    });
    if (!user) {
      throw new COM_CER001_003Exception(
        `user not found with userID: ${loginId.trim()}`,
      );
    }

    const passwordMatching = await argon.verify(user.password, password);
    if (!passwordMatching) {
      throw new COM_CER001_003Exception('incorrect password');
    }

    return user;
  }

  async login(user: LoginUserDto) {
    const sessionId = randomUUID();

    const { accessToken, refreshToken, rtJwtId } = await this.generateTokenPair(
      user,
      sessionId,
    );

    await this.sessionRepository.buildSession({
      mUserId: user.mUserId,
      sessionId,
      jwtId: rtJwtId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken({ mUserId, sessionId, jti }: RefreshTokenPayload) {
    const session = await this.sessionRepository.findOneBy({
      mUserId,
      sessionId,
    });
    if (!session) {
      throw new COM_CER001_001Exception(
        `session not found with mUserId: ${mUserId} and sessionId: ${sessionId}`,
      );
    }

    const jwtIdMatching = session.jwtId === jti;
    if (!jwtIdMatching) {
      await this.logoutAllSession(mUserId);

      throw new COM_CER001_001Exception(`no matching jwtId: ${jti}`);
    }

    const user = await this.mUserRepository.findOneBy({ mUserId });
    if (!user) {
      throw new COM_CER001_001Exception(
        `user not found with mUserId: ${mUserId}`,
      );
    }

    return user;
  }

  async refreshToken(user: LoginUserDto, sessionId: string) {
    const session = await this.sessionRepository.findOneBy({
      mUserId: user.mUserId,
      sessionId,
    });
    if (!session) {
      throw new COM_CER001_001Exception(
        `session not found with mUserId: ${user.mUserId} and sessionId: ${sessionId}`,
      );
    }

    const { accessToken, refreshToken, rtJwtId } = await this.generateTokenPair(
      user,
      sessionId,
    );

    session.jwtId = rtJwtId;
    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(mUserId: number, sessionId: string) {
    const session = await this.sessionRepository.findOneBy({
      mUserId,
      sessionId,
    });
    if (!session) {
      throw new COM_CER001_001Exception(
        `session not found with mUserId: ${mUserId} and sessionId: ${sessionId}`,
      );
    }

    return this.sessionRepository.remove(session);
  }

  async forgotPassword({ mailAddress }: ForgotPasswordBodyDto) {
    const user = await this.mUserRepository.findOneBy({ mailAddress });
    if (!user) {
      throw new COM_CER002_001Exception(
        `user not found with email: ${mailAddress}`,
      );
    }

    const randomPassword = generatePassword();

    user.password = randomPassword;
    await this.mUserRepository.save(user);

    await this.logoutAllSession(user.mUserId);

    this.mailerService
      .sendMail({
        recipients: {
          to: [{ address: mailAddress }],
        },
        subject: BaseMail.forgotPassword.subject,
        template: BaseMail.forgotPassword.template,
        context: {
          userNm: user.userNm,
          mailAddress: user.mailAddress,
          userId: user.userId,
          isShowPassword: true,
          password: randomPassword,
          url: this.appConfigService.commonConfig.appUrl,
        },
      })
      .catch(error =>
        this.logger.error(`[forgotPassword] Fail to send mail cause ${error}`),
      );
  }

  async generateTokenPair(user: LoginUserDto, sessionId: string) {
    const rtJwtId = randomUUID();

    const accessToken = await this.jwtService.signAsync({ ...user, sessionId });
    const refreshToken = await this.jwtService.signAsync(
      { mUserId: user.mUserId, sessionId },
      {
        privateKey: this.appConfigService.authConfig.rtPrivateKey,
        expiresIn: this.appConfigService.authConfig.rtExpire,
        jwtid: rtJwtId,
      },
    );

    return {
      accessToken,
      refreshToken,
      rtJwtId,
    };
  }

  async logoutAllSession(mUserId: number) {
    const sessions = await this.sessionRepository.findBy({ mUserId });

    return this.sessionRepository.remove(sessions);
  }

  async removeSession() {
    return this.client
      .emit(AppEventPattern.Batch.REMOVE_SESSION, {})
      .pipe(map(() => null));
  }
}
