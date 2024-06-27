import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { COM_CER001_001Exception } from '@app/common/filters/exceptions/COM_CER001_001.exception';
import { COM_CER001_003Exception } from '@app/common/filters/exceptions/COM_CER001_003.exception';
import { COM_CER002_001Exception } from '@app/common/filters/exceptions/COM_CER002_001.exception';
import { mailerServiceMock } from '@app/common/mocks/mailerService.mock';
import { MailerService } from '@app/common/services/mailer.service';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { sessionEntityStub } from '@app/common/stubs/sessionEntity.stub';
import { AppService } from '@app/common/types/common.type';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { faker } from '@faker-js/faker';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mUserRepository: DeepMocked<MUserRepository>;
  let sessionRepository: DeepMocked<SessionRepository>;
  let jwtService: DeepMocked<JwtService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AppService.BATCH_SERVICE, useValue: {} },
        { provide: MailerService, useValue: mailerServiceMock },
      ],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get(AuthService);
    mUserRepository = module.get(MUserRepository);
    sessionRepository = module.get(SessionRepository);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    let loginId: string;
    let password: string;

    beforeEach(() => {
      loginId = faker.internet.userName();
      password = faker.internet.password();
    });

    it('not found user', async () => {
      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(null);

      const response = authService.validateUser(loginId, password);

      await expect(response).rejects.toBeInstanceOf(COM_CER001_003Exception);
      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('found user but not matching password', async () => {
      const user = await mUserEntityStub({ userId: loginId });

      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(user);

      const response = authService.validateUser(loginId, password);

      await expect(response).rejects.toBeInstanceOf(COM_CER001_003Exception);
      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
      expect(user.userId).toBe(loginId);
    });

    it('validate user success', async () => {
      const user = await mUserEntityStub({ userId: loginId, password });

      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(user);

      const response = await authService.validateUser(loginId, password);

      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
      expect(user.userId).toBe(loginId);
      expect(response).toBeDefined();
      expect(response).toEqual(user);
      expect(response.userId).toBe(loginId);
    });
  });

  describe('login', () => {
    let accessToken: string;
    let refreshToken: string;
    let user: LoginUserDto;

    beforeEach(async () => {
      accessToken = faker.string.sample();
      refreshToken = faker.string.sample();
      user = (await mUserEntityStub()).toLoginUser();
    });

    it('login success', async () => {
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const buildSession = sessionRepository.buildSession.mockImplementation();

      const response = await authService.login(user);

      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(buildSession).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
    });
  });

  describe('validateRefreshToken', () => {
    let mUserId: number;
    let sessionId: string;
    let jti: string;

    beforeEach(async () => {
      mUserId = faker.number.int();
      sessionId = faker.string.uuid();
      jti = faker.string.uuid();
    });

    it('invalid token because not found session', async () => {
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(null);

      const response = authService.validateRefreshToken({
        mUserId,
        sessionId,
        jti,
      });

      await expect(response).rejects.toBeInstanceOf(COM_CER001_001Exception);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('invalid token because jwtId not matching', async () => {
      const session = sessionEntityStub({ sessionId, mUserId });

      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const logoutAllSession = jest
        .spyOn(authService, 'logoutAllSession')
        .mockImplementation();

      const response = authService.validateRefreshToken({
        mUserId,
        sessionId,
        jti,
      });

      await expect(response).rejects.toBeInstanceOf(COM_CER001_001Exception);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.sessionId).toBe(sessionId);
      expect(session.mUserId).toBe(mUserId);
      expect(logoutAllSession).toHaveBeenCalledTimes(1);
      expect(logoutAllSession).toHaveBeenCalledWith(mUserId);
    });

    it('valid token but not found user', async () => {
      const session = sessionEntityStub({ sessionId, mUserId, jwtId: jti });

      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(null);

      const response = authService.validateRefreshToken({
        mUserId,
        sessionId,
        jti,
      });

      await expect(response).rejects.toBeInstanceOf(COM_CER001_001Exception);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.sessionId).toBe(sessionId);
      expect(session.mUserId).toBe(mUserId);
      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('validate refresh token success', async () => {
      const session = sessionEntityStub({ jwtId: jti, mUserId, sessionId });
      const user = await mUserEntityStub({ mUserId });

      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(user);

      const response = await authService.validateRefreshToken({
        mUserId,
        sessionId,
        jti,
      });

      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.sessionId).toBe(sessionId);
      expect(session.mUserId).toBe(mUserId);
      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();
      expect(response).toEqual(user);
      expect(response.mUserId).toBe(session.mUserId);
      expect(response.mUserId).toBe(mUserId);
    });
  });

  describe('refreshToken', () => {
    let user: LoginUserDto;
    let sessionId: string;

    beforeEach(async () => {
      user = (await mUserEntityStub()).toLoginUser();
      sessionId = faker.string.uuid();
    });

    it('invalid session', async () => {
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(null);

      const response = authService.refreshToken(user, sessionId);

      await expect(response).rejects.toBeInstanceOf(COM_CER001_001Exception);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('refresh token success', async () => {
      const session = sessionEntityStub({ mUserId: user.mUserId, sessionId });
      const accessToken = faker.string.sample();
      const refreshToken = faker.string.sample();
      const rtJwtId = randomUUID();

      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId,
        });
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await authService.refreshToken(user, sessionId);

      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(session.mUserId).toBe(user.mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(session.jwtId).toBe(rtJwtId);
    });
  });

  describe('logout', () => {
    let mUserId: number;
    let sessionId: string;

    beforeEach(() => {
      mUserId = faker.number.int();
      sessionId = faker.string.uuid();
    });

    it('invalid session', async () => {
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(null);

      const response = authService.logout(mUserId, sessionId);

      await expect(response).rejects.toBeInstanceOf(COM_CER001_001Exception);
      expect(sessionFindOneBy).toHaveBeenCalled();
    });

    it('logout success', async () => {
      const session = sessionEntityStub({ mUserId, sessionId });

      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const sessionRemove = sessionRepository.remove.mockImplementation();

      await authService.logout(mUserId, sessionId);

      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenCalledWith(session);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
    });
  });

  describe('forgotPassword', () => {
    let mailAddress: string;

    beforeEach(() => {
      mailAddress = faker.internet.email();
    });

    it('email not found', async () => {
      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(null);

      const response = authService.forgotPassword({ mailAddress });

      await expect(response).rejects.toBeInstanceOf(COM_CER002_001Exception);
      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('forgot password success', async () => {
      const user = await mUserEntityStub({ mailAddress });

      const mUserFindOneBy = mUserRepository.findOneBy.mockResolvedValue(user);
      const mUserSave = mUserRepository.save.mockImplementation();
      const logoutAllSession = jest
        .spyOn(authService, 'logoutAllSession')
        .mockImplementation();

      await authService.forgotPassword({ mailAddress });

      expect(mUserFindOneBy).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(logoutAllSession).toHaveBeenCalledTimes(1);
      expect(logoutAllSession).toHaveBeenCalledWith(user.mUserId);
      expect(user.mailAddress).toBe(mailAddress);
      expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateTokenPair', () => {
    let user: LoginUserDto;
    let sessionId: string;

    beforeEach(async () => {
      user = (await mUserEntityStub()).toLoginUser();
      sessionId = faker.string.uuid();
    });

    it('generateTokenPair success', async () => {
      const accessToken = faker.string.symbol();
      const refreshToken = faker.string.symbol();

      const signAccessToken =
        jwtService.signAsync.mockResolvedValueOnce(accessToken);
      const signRefreshToken =
        jwtService.signAsync.mockResolvedValueOnce(refreshToken);

      const response = await authService.generateTokenPair(user, sessionId);

      expect(signAccessToken).toHaveBeenCalledTimes(2);
      expect(signRefreshToken).toHaveBeenCalledTimes(2);
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
    });
  });

  describe('logoutAllSession', () => {
    let mUserId: number;

    beforeEach(() => {
      mUserId = faker.number.int();
    });

    it('logout all session success', async () => {
      const sessions = [sessionEntityStub()];

      const sessionFindBy =
        sessionRepository.findBy.mockResolvedValue(sessions);
      const sessionRemove = sessionRepository.remove.mockImplementation();

      await authService.logoutAllSession(mUserId);

      expect(sessionFindBy).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenCalledWith(sessions);
    });
  });
});
