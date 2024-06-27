import { AuthService } from '@api/auth/auth.service';
import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_USR002_001Exception } from '@app/common/filters/exceptions/MST_USR002_001.exception';
import { MST_USR002_002Exception } from '@app/common/filters/exceptions/MST_USR002_002.exception';
import { MST_USR002_003Exception } from '@app/common/filters/exceptions/MST_USR002_003.exception';
import { MST_USR002_004Exception } from '@app/common/filters/exceptions/MST_USR002_004.exception';
import { MST_USR002_005Exception } from '@app/common/filters/exceptions/MST_USR002_005.exception';
import { MST_USR002_006Exception } from '@app/common/filters/exceptions/MST_USR002_006.exception';
import { MST_USR002_007Exception } from '@app/common/filters/exceptions/MST_USR002_007.exception';
import { MST_USR002_008Exception } from '@app/common/filters/exceptions/MST_USR002_008.exception';
import { MST_USR003_001Exception } from '@app/common/filters/exceptions/MST_USR003_001.exception';
import { mailerServiceMock } from '@app/common/mocks/mailerService.mock';
import { MailerService } from '@app/common/services/mailer.service';
import { mBaseEntityStub } from '@app/common/stubs/mBaseEntity.stub';
import { mDriverEntityStub } from '@app/common/stubs/mDriver.stub';
import { mTransportCompanyEntityStub } from '@app/common/stubs/mTransportCompanyEntity.stub';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { sessionEntityStub } from '@app/common/stubs/sessionEntity.stub';
import { OrderBy } from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import { getPagination } from '@app/common/utils/getPagination.util';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { SessionEntity } from '@app/database/entities/session.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { faker } from '@faker-js/faker';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateUserBodyDto } from './dtos/createUserBody.dto';
import { UpdateUserBodyDto } from './dtos/updateUserBody.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mUserRepository: DeepMocked<MUserRepository>;
  let mBaseRepository: DeepMocked<MBaseRepository>;
  let authService: DeepMocked<AuthService>;
  let sessionRepository: DeepMocked<SessionRepository>;
  let mTransportCompanyRepository: DeepMocked<MTransportCompanyRepository>;
  let mDriverRepository: DeepMocked<MDriverRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        UserAbilityFactory,
        { provide: MailerService, useValue: mailerServiceMock },
      ],
    })
      .useMocker(createMock)
      .compile();

    userService = module.get(UserService);
    mUserRepository = module.get(MUserRepository);
    mBaseRepository = module.get(MBaseRepository);
    authService = module.get(AuthService);
    sessionRepository = module.get(SessionRepository);
    mTransportCompanyRepository = module.get(MTransportCompanyRepository);
    mDriverRepository = module.get(MDriverRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getProfile', () => {
    let mUserId: number;

    beforeEach(() => {
      mUserId = faker.number.int();
    });

    it('not found profile', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(null);

      const response = userService.getProfile(mUserId);

      await expect(response).rejects.toBeInstanceOf(MST_USR003_001Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
    });

    it('get profile success', async () => {
      const user = await mUserEntityStub({ mUserId });

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

      const response = await userService.getProfile(mUserId);

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();
      expect(response).toEqual(user);
      expect(response.mUserId).toBe(mUserId);
    });
  });

  describe('updateProfile', () => {
    let mUserId: number;
    let sessionId: string;
    let user: MUserEntity;
    let session: SessionEntity;
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      mUserId = faker.number.int();
      sessionId = faker.string.uuid();
      user = await mUserEntityStub({ mUserId });
      session = sessionEntityStub({ mUserId, sessionId });
      accessToken = faker.string.symbol();
      refreshToken = faker.string.symbol();
    });

    it('not found profile', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(null);

      const response = userService.updateProfile(mUserId, sessionId, {});

      await expect(response).rejects.toBeInstanceOf(MST_USR002_001Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
    });

    it('not found session', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(null);

      const response = userService.updateProfile(mUserId, sessionId, {});

      await expect(response).rejects.toBeInstanceOf(MST_USR002_001Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('update main base but not found base', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mBaseFindOneBy = mBaseRepository.findOneBy.mockResolvedValue(null);

      const response = userService.updateProfile(mUserId, sessionId, {
        mainBaseId: faker.number.int(),
      });

      await expect(response).rejects.toBeInstanceOf(MST_USR002_001Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('update main base success', async () => {
      const mainBaseId = faker.number.int();
      const mainBase = mBaseEntityStub({ baseId: mainBaseId });

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mBaseFindOneBy =
        mBaseRepository.findOneBy.mockResolvedValue(mainBase);
      const mUserSave = mUserRepository.save.mockImplementation(saveUser => {
        saveUser.mainBaseId = mainBaseId;

        return <Promise<MUserEntity>>Promise.resolve(saveUser);
      });
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        mainBaseId,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
      expect(mainBase.baseId).toBe(mainBaseId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
      expect(response.user.mainBaseId).toBe(mainBaseId);
      expect(response.user.mainBase).toEqual(mainBase);
    });

    it('remove main base success', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserSave = mUserRepository.save.mockImplementation();
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        mainBaseId: null as any,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
      expect(response.user.mainBaseId).toBeNull();
    });

    it('update password but not matching password', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);

      const response = userService.updateProfile(mUserId, sessionId, {
        password: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      await expect(response).rejects.toBeInstanceOf(MST_USR002_002Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
    });

    it('update password success', async () => {
      const password = faker.internet.password();
      const newPassword = faker.internet.password();
      user = await mUserEntityStub({ mUserId, password });

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserSave = mUserRepository.save.mockImplementation();
      const logoutAllSession = jest
        .spyOn(authService, 'logoutAllSession')
        .mockImplementation();
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        password,
        newPassword,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(user.password).toBe(newPassword);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(logoutAllSession).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
    });

    it('update profile success', async () => {
      const userNm = faker.person.fullName();
      const userNmKn = faker.person.fullName();

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserSave = mUserRepository.save.mockImplementation();
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        userNm,
        userNmKn,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
      expect(response.user.userNm).toBe(userNm);
      expect(response.user.userNmKn).toEqual(userNmKn);
    });

    it('update profile, password success', async () => {
      const userNm = faker.person.fullName();
      const password = faker.internet.password();
      const newPassword = faker.internet.password();
      user = await mUserEntityStub({ mUserId, password });

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserSave = mUserRepository.save.mockImplementation();
      const logoutAllSession = jest
        .spyOn(authService, 'logoutAllSession')
        .mockImplementation();
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        userNm,
        password,
        newPassword,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(user.password).toBe(newPassword);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(logoutAllSession).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
      expect(response.user.userNm).toBe(userNm);
    });

    it('update profile, main base, password success', async () => {
      const userNmKn = faker.person.fullName();
      const password = faker.internet.password();
      const newPassword = faker.internet.password();
      const mainBaseId = faker.number.int();
      const mainBase = mBaseEntityStub({ baseId: mainBaseId });
      user = await mUserEntityStub({ mUserId, password });

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mBaseFindOneBy =
        mBaseRepository.findOneBy.mockResolvedValue(mainBase);
      const mUserSave = mUserRepository.save.mockImplementation(saveUser => {
        saveUser.mainBaseId = mainBaseId;

        return <Promise<MUserEntity>>Promise.resolve(saveUser);
      });
      const logoutAllSession = jest
        .spyOn(authService, 'logoutAllSession')
        .mockImplementation();
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        userNmKn,
        password,
        newPassword,
        mainBaseId,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(user.password).toBe(newPassword);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
      expect(mainBase.baseId).toBe(mainBaseId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(logoutAllSession).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
      expect(response.user.userNmKn).toBe(userNmKn);
      expect(response.user.mainBaseId).toBe(mainBaseId);
      expect(response.user.mainBase).toEqual(mainBase);
    });

    it('update profile and send mail success', async () => {
      user.mailAddress = faker.internet.email();
      const userNmKn = faker.person.fullName();

      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
      const sessionFindOneBy =
        sessionRepository.findOneBy.mockResolvedValue(session);
      const mUserSave = mUserRepository.save.mockImplementation();
      const generateTokenPair = jest
        .spyOn(authService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken,
          refreshToken,
          rtJwtId: randomUUID(),
        });
      const sessionSave = sessionRepository.save.mockImplementation();

      const response = await userService.updateProfile(mUserId, sessionId, {
        userNmKn,
      });

      expect(mUserFindOne).toHaveBeenCalledTimes(1);
      expect(user.mUserId).toBe(mUserId);
      expect(sessionFindOneBy).toHaveBeenCalledTimes(1);
      expect(session.mUserId).toBe(mUserId);
      expect(session.sessionId).toBe(sessionId);
      expect(mUserSave).toHaveBeenCalledTimes(1);
      expect(mUserSave).toHaveBeenCalledWith(user);
      expect(generateTokenPair).toHaveBeenCalledTimes(1);
      expect(generateTokenPair).toHaveBeenCalledWith(
        user.toLoginUser(),
        sessionId,
      );
      expect(sessionSave).toHaveBeenCalledTimes(1);
      expect(sessionSave).toHaveBeenCalledWith(session);
      expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();
      expect(response.accessToken).toBe(accessToken);
      expect(response.refreshToken).toBe(refreshToken);
      expect(response.user).toEqual(user);
      expect(response.user.userNmKn).toEqual(userNmKn);
    });
  });

  describe('getListUser', () => {
    it('should return a list of users', async () => {
      const currentUser = await mUserEntityStub();
      const userTest1 = await mUserEntityStub();
      const userTest2 = await mUserEntityStub();
      const mockValueCount = faker.number.int();
      const listUserQuery = {
        page: faker.number.int(),
        limit: faker.number.int(),
        sort: { mUserId: OrderBy.DESC },
      };

      const getListUserResponse = [userTest1, userTest2];

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => createQueryBuilder),
        addSelect: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoin: jest.fn().mockImplementation(() => createQueryBuilder),
        addOrderBy: jest.fn().mockImplementation(() => createQueryBuilder),
        limit: jest.fn().mockImplementation(() => createQueryBuilder),
        offset: jest.fn().mockImplementation(() => createQueryBuilder),
        take: jest.fn().mockImplementation(() => createQueryBuilder),
        groupBy: jest.fn().mockImplementation(() => createQueryBuilder),
        skip: jest.fn().mockImplementation(() => createQueryBuilder),
        where: jest.fn().mockImplementation(() => createQueryBuilder),
        andWhere: jest.fn().mockImplementation(() => createQueryBuilder),
        getCount: jest.fn().mockResolvedValue(mockValueCount),
        getRawMany: jest.fn().mockResolvedValue(getListUserResponse),
      };

      jest
        .spyOn(mUserRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = await userService.getListUser(
        currentUser.toLoginUser(),
        listUserQuery,
      );

      const pagination = getPagination(
        result.results.length,
        mockValueCount,
        listUserQuery.page,
        listUserQuery.limit,
      );

      expect(mUserRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.results).toEqual([userTest1, userTest2]);
      expect(result.pagination).toBeDefined();
      expect(result.pagination).toEqual(pagination);
    });
  });

  describe('createUser', () => {
    let currentUser: LoginUserDto;
    let body: CreateUserBodyDto;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      body = {
        userNm: faker.person.fullName(),
        userNmKn: faker.person.fullName(),
        roleDiv: RoleDiv.CARRIAGE_COMPANY,
      };
    });

    it('create user with mailAddress already exists', async () => {
      body.mailAddress = faker.internet.email();

      const mUserFindExistAndThrow =
        mUserRepository.findExistAndThrow.mockRejectedValue(
          new MST_USR002_008Exception(),
        );

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_008Exception);
      expect(mUserFindExistAndThrow).toHaveBeenCalledTimes(1);
    });

    it('create user with userId already exists', async () => {
      body.userId = faker.string.sample();

      const mUserFindExistAndThrow =
        mUserRepository.findExistAndThrow.mockRejectedValue(
          new MST_USR002_003Exception(),
        );

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_003Exception);
      expect(mUserFindExistAndThrow).toHaveBeenCalledTimes(1);
    });

    it('create system admin but assign transport company', async () => {
      body.roleDiv = RoleDiv.SYSTEM_ADMIN;
      body.transportCompanyId = faker.number.int();

      const mUserCreate = mUserRepository.create.mockImplementation();

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toBeCalledWith(body);
    });

    it('create kyoto spacer but assign transport company', async () => {
      body.roleDiv = RoleDiv.KYOTO_SPACER;
      body.transportCompanyId = faker.number.int();

      const mUserCreate = mUserRepository.create.mockImplementation();

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
    });

    it('assign not found transport company', async () => {
      body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
      body.transportCompanyId = faker.number.int();

      const mUserCreate = mUserRepository.create.mockImplementation();
      const mTransportCompanyFindOneBy =
        mTransportCompanyRepository.findOneBy.mockResolvedValue(null);

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('create transport company role div but assign carriage company', async () => {
      body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
      body.transportCompanyId = faker.number.int();
      const transportCompany = mTransportCompanyEntityStub({
        transportCompanyId: body.transportCompanyId,
        parentCompanyId: faker.number.int(),
      });

      const mUserCreate = mUserRepository.create.mockImplementation();
      const mTransportCompanyFindOneBy =
        mTransportCompanyRepository.findOneBy.mockResolvedValue(
          transportCompany,
        );

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(body.transportCompanyId);
    });

    it('create carriage company role div but assign transport company', async () => {
      body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
      body.transportCompanyId = faker.number.int();
      const transportCompany = mTransportCompanyEntityStub({
        transportCompanyId: body.transportCompanyId,
      });

      const mUserCreate = mUserRepository.create.mockImplementation();
      const mTransportCompanyFindOneBy =
        mTransportCompanyRepository.findOneBy.mockResolvedValue(
          transportCompany,
        );

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(body.transportCompanyId);
    });

    it('assign not found main base', async () => {
      body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
      body.mainBaseId = faker.number.int();

      const mUserCreate = mUserRepository.create.mockImplementation();
      const mBaseFindOneBy = mBaseRepository.findOneBy.mockResolvedValue(null);

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
      expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('assign not found driver', async () => {
      body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
      body.driverId = faker.number.int();

      const mUserCreate = mUserRepository.create.mockImplementation();
      const mDriverFindOneBy =
        mDriverRepository.findOneBy.mockResolvedValue(null);

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
      expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('assign driver not in request transport company', async () => {
      body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
      body.driverId = faker.number.int();
      const driver = mDriverEntityStub({
        driverId: body.driverId,
        transportCompanyId: faker.number.int(),
      });

      const mUserCreate = mUserRepository.create.mockImplementation();
      const mDriverFindOneBy =
        mDriverRepository.findOneBy.mockResolvedValue(driver);

      const response = userService.createUser(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
      expect(mUserCreate).toHaveBeenCalledTimes(1);
      expect(mUserCreate).toHaveBeenCalledWith(body);
      expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
      expect(driver.driverId).toBe(body.driverId);
    });

    describe('create user with system admin', () => {
      beforeEach(async () => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('create system admin success', async () => {
        body.roleDiv = RoleDiv.SYSTEM_ADMIN;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
      });

      it('create kyoto spacer success', async () => {
        body.roleDiv = RoleDiv.KYOTO_SPACER;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
      });

      it('create transport company role div success', async () => {
        body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
      });

      it('create carriage company role div success', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
      });

      it('create user and send mail success', async () => {
        body.roleDiv = RoleDiv.SYSTEM_ADMIN;
        body.mailAddress = faker.internet.email();
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
      });
    });

    describe('create user with kyoto spacer', () => {
      beforeEach(async () => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      it('cannot create system admin', async () => {
        body.roleDiv = RoleDiv.SYSTEM_ADMIN;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('create kyoto spacer success', async () => {
        body.roleDiv = RoleDiv.KYOTO_SPACER;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
      });

      it('create transport company role div success', async () => {
        body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
      });

      it('cannot create carriage company role div', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('create user and send mail success', async () => {
        body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        body.mailAddress = faker.internet.email();
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
      });
    });

    describe('create user with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot create system admin', async () => {
        body.roleDiv = RoleDiv.SYSTEM_ADMIN;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('cannot create kyoto spacer role div', async () => {
        body.roleDiv = RoleDiv.KYOTO_SPACER;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('cannot create transport company role div in other companies', async () => {
        body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        body.transportCompanyId = faker.number.int();
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.transportCompanyId,
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
      });

      it('create transport company role div in same company success', async () => {
        body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        body.transportCompanyId = currentUser.transportCompanyId;
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.transportCompanyId,
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(response.transportCompany).toEqual(transportCompany);
        expect(response.transportCompanyId).toBe(
          currentUser.transportCompanyId,
        );
      });

      it('cannot create carriage company role div in other companies', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        body.transportCompanyId = faker.number.int();
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: body.transportCompanyId,
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.parentCompanyId).toBe(body.transportCompanyId);
      });

      it('create carriage company role div in same company success', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        body.transportCompanyId = currentUser.transportCompanyId;
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: body.transportCompanyId,
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.parentCompanyId).toBe(body.transportCompanyId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(response.transportCompany).toEqual(transportCompany);
        expect(response.transportCompany?.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
      });

      it('create user and send mail success', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        body.transportCompanyId = currentUser.transportCompanyId;
        body.mailAddress = faker.internet.email();
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: body.transportCompanyId,
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.parentCompanyId).toBe(body.transportCompanyId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(response.transportCompany).toEqual(transportCompany);
        expect(response.transportCompany?.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
      });
    });

    describe('create user with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot create system admin', async () => {
        body.roleDiv = RoleDiv.SYSTEM_ADMIN;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('cannot create kyoto spacer role div', async () => {
        body.roleDiv = RoleDiv.KYOTO_SPACER;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('cannot create transport company role div', async () => {
        body.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        const user = await mUserEntityStub(body);

        const mUserCreate = mUserRepository.create.mockReturnValue(user);

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
      });

      it('cannot create carriage company role div in other companies', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        body.transportCompanyId = faker.number.int();
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );

        const response = userService.createUser(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_004Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
      });

      it('create carriage company role div in same company success', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        body.transportCompanyId = currentUser.transportCompanyId;
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(response.transportCompany).toEqual(transportCompany);
        expect(response.transportCompanyId).toBe(
          currentUser.transportCompanyId,
        );
      });

      it('create user and send mail success', async () => {
        body.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        body.transportCompanyId = currentUser.transportCompanyId;
        body.mailAddress = faker.internet.email();
        const user = await mUserEntityStub(body);
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mUserCreate = mUserRepository.create.mockReturnValue(user);
        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mUserSave = mUserRepository.save.mockImplementation();

        const response = await userService.createUser(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toEqual(user);
        expect(response.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(response.transportCompany).toEqual(transportCompany);
        expect(response.transportCompanyId).toBe(
          currentUser.transportCompanyId,
        );
      });
    });
  });

  describe('updateUser', () => {
    let currentUser: LoginUserDto;
    let mUserId: number;
    let body: UpdateUserBodyDto;
    let user: MUserEntity;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      mUserId = faker.number.int();
      body = {
        userNm: faker.person.fullName(),
        userNmKn: faker.person.fullName(),
      };
      user = await mUserEntityStub({ mUserId });
    });

    it('not found user', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(null);

      const response = userService.updateUser(currentUser, mUserId, body);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_005Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
    });

    describe('update user with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      describe('update system admin', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.SYSTEM_ADMIN;
        });

        it('cannot assign transport company', async () => {
          body.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver', async () => {
          body.driverId = faker.number.int();
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('update system admin success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update system admin and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });

      describe('update kyoto spacer', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.KYOTO_SPACER;
        });

        it('cannot assign transport company', async () => {
          body.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver', async () => {
          body.driverId = faker.number.int();
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('update kyoto spacer success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update kyoto spacer and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });

      describe('update transport company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        });

        it('assign transport company but not found', async () => {
          body.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign carriage company to transport company role div', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
            parentCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver not in the same company', async () => {
          body.driverId = faker.number.int();
          user.transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: faker.number.int(),
          });
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('update transport company role div success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update transport company role div and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });

      describe('update carriage company success', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        });

        it('assign transport company but not found', async () => {
          body.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign transport company to carriage company role div', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver not in the same company', async () => {
          body.driverId = faker.number.int();
          user.transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: faker.number.int(),
          });
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('update carriage company role div success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update carriage company role div and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });
    });

    describe('update user with kyoto spacer', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      describe('update system admin', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.SYSTEM_ADMIN;
        });

        it('cannot update system admin', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });

      describe('update kyoto spacer', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.KYOTO_SPACER;
        });

        it('cannot assign transport company', async () => {
          body.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver', async () => {
          body.driverId = faker.number.int();
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('update kyoto spacer success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update kyoto spacer and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });

      describe('update transport company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        });

        it('assign transport company but not found', async () => {
          body.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign carriage company to transport company role div', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
            parentCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver not in the same company', async () => {
          body.driverId = faker.number.int();
          user.transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: faker.number.int(),
          });
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('update transport company role div success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update transport company role div and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });

      describe('update carriage company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        });

        it('cannot update carriage company role div', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });
    });

    describe('update user with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      describe('update system admin', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.SYSTEM_ADMIN;
        });

        it('cannot update system admin', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });

      describe('update kyoto spacer', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.KYOTO_SPACER;
        });

        it('cannot update kyoto spacer', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });

      describe('update transport company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
          user.transportCompanyId = currentUser.transportCompanyId;
        });

        it('cannot update transport company role div in other companies', async () => {
          user.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver not in the same company', async () => {
          body.driverId = faker.number.int();
          user.transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: user.transportCompanyId,
          });
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('cannot update transport company role div to other companies', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('update transport company role div in same company success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update transport company role div and send mail success', async () => {
          user.mailAddress = faker.internet.email();
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });

      describe('update carriage company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
          user.transportCompany = mTransportCompanyEntityStub({
            parentCompanyId: currentUser.transportCompanyId,
          });
        });

        it('cannot update carriage company role div in other companies', async () => {
          user.transportCompany = mTransportCompanyEntityStub({
            parentCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });

        it('cannot assign transport company to carriage company role div', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver not in the same company', async () => {
          body.driverId = faker.number.int();
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('cannot update carriage company role div to other companies', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
            parentCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
          expect(transportCompany.transportCompanyId).toBe(
            body.transportCompanyId,
          );
        });

        it('update carriage company role div in same company success', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
            parentCompanyId: currentUser.transportCompanyId,
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
          expect(transportCompany.transportCompanyId).toBe(
            body.transportCompanyId,
          );
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update carriage company role div and send mail success', async () => {
          user.mailAddress = faker.internet.email();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });
    });

    describe('update user with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      describe('update system admin', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.SYSTEM_ADMIN;
        });

        it('cannot update system admin', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });

      describe('update kyoto spacer', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.KYOTO_SPACER;
        });

        it('cannot update kyoto spacer', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });

      describe('update transport company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        });

        it('cannot update transport company role div', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });
      });

      describe('update carriage company role div', () => {
        beforeEach(() => {
          user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
          user.transportCompanyId = currentUser.transportCompanyId;
        });

        it('cannot update carriage company role div in other companies', async () => {
          user.transportCompanyId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
        });

        it('assign main base but base not found', async () => {
          body.mainBaseId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mBaseFindOneBy =
            mBaseRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mBaseFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('assign driver but driver not found', async () => {
          body.driverId = faker.number.int();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(null);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
        });

        it('cannot assign driver not in the same company', async () => {
          body.driverId = faker.number.int();
          const driver = mDriverEntityStub({
            driverId: body.driverId,
            transportCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mDriverFindOneBy =
            mDriverRepository.findOneBy.mockResolvedValue(driver);

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mDriverFindOneBy).toHaveBeenCalledTimes(1);
          expect(driver.driverId).toBe(body.driverId);
        });

        it('cannot update carriage company role div to other companies', async () => {
          body.transportCompanyId = faker.number.int();
          const transportCompany = mTransportCompanyEntityStub({
            transportCompanyId: body.transportCompanyId,
            parentCompanyId: faker.number.int(),
          });

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mTransportCompanyFindOneBy =
            mTransportCompanyRepository.findOneBy.mockResolvedValue(
              transportCompany,
            );

          const response = userService.updateUser(currentUser, mUserId, body);

          await expect(response).rejects.toBeInstanceOf(
            MST_USR002_005Exception,
          );
          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
          expect(transportCompany.transportCompanyId).toBe(
            body.transportCompanyId,
          );
        });

        it('update carriage company role div in same company success', async () => {
          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });

        it('update carriage company role div and send mail success', async () => {
          user.mailAddress = faker.internet.email();

          const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
          const mUserSave = mUserRepository.save.mockImplementation();

          const response = await userService.updateUser(
            currentUser,
            mUserId,
            body,
          );

          expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(user.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
          expect(mUserFindOne).toHaveBeenCalledTimes(1);
          expect(user.mUserId).toBe(mUserId);
          expect(mUserSave).toHaveBeenCalledTimes(1);
          expect(mUserSave).toHaveBeenCalledWith(user);
          expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
          expect(response).toBeDefined();
          expect(response).toEqual(user);
          expect(response.userNm).toBe(body.userNm);
          expect(response.userNmKn).toBe(body.userNmKn);
        });
      });
    });
  });

  describe('deleteUser', () => {
    let currentUser: LoginUserDto;
    let mUserId: number;
    let user: MUserEntity;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      mUserId = faker.number.int();
      user = await mUserEntityStub({ mUserId });
    });

    it('not found user', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(null);

      const response = userService.deleteUser(currentUser, mUserId);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
    });

    describe('delete user with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('delete system admin success', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });

      it('delete kyoto spacer success', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });

      it('delete transport company role div success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });

      it('delete carriage company role div success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });
    });

    describe('delete user with kyoto spacer', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      it('cannot delete system admin', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('delete kyoto spacer success', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });

      it('delete transport company role div success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });

      it('cannot delete carriage company role div', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });
    });

    describe('delete user with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete system admin', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot delete kyoto spacer', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot delete transport company role div in other companies', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        user.transportCompanyId = faker.number.int();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('delete transport company role div in the same company success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        user.transportCompanyId = currentUser.transportCompanyId;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });

      it('cannot delete carriage company role div in other companies', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: faker.number.int(),
        });

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('delete carriage company role div in the same company success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: currentUser.transportCompanyId,
        });

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });
    });

    describe('delete user with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete system admin', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot delete kyoto spacer', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot delete transport company role div', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot delete carriage company role div in other companies', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompanyId = faker.number.int();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.deleteUser(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_006Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('delete carriage company role div in same company success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompanyId = currentUser.transportCompanyId;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserRemove = mUserRepository.remove.mockImplementation();

        await userService.deleteUser(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserRemove).toHaveBeenCalledTimes(1);
        expect(mUserRemove).toHaveBeenCalledWith(user);
      });
    });
  });

  describe('initPassword', () => {
    let currentUser: LoginUserDto;
    let mUserId: number;
    let user: MUserEntity;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      mUserId = faker.number.int();
      user = await mUserEntityStub({ mUserId });
    });

    it('not found user', async () => {
      const mUserFindOne = mUserRepository.findOne.mockResolvedValue(null);

      const response = userService.initPassword(currentUser, mUserId);

      await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
      expect(mUserFindOne).toHaveBeenCalledTimes(1);
    });

    describe('init password with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('init password of system admin success', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password of kyoto spacer success', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password of transport company role div success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password of carriage company role div success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password and send mail success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.mailAddress = faker.internet.email();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
      });
    });

    describe('init password with kyoto spacer', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      it('cannot init password of system admin', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('init password of kyoto spacer success', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password of transport company role div success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('cannot init password of carriage company role div', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('init password and send mail success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        user.mailAddress = faker.internet.email();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
      });
    });

    describe('init password with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot init password of system admin', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot init password of kyoto spacer', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot init password of transport company role div in other companies', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        user.transportCompanyId = faker.number.int();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('init password of transport company role div in the same company success', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        user.transportCompanyId = currentUser.transportCompanyId;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('cannot init password of carriage company role div in another company', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: faker.number.int(),
        });

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('init password of carriage company role div in the same company success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: currentUser.transportCompanyId,
        });

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password and send mail success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: currentUser.transportCompanyId,
        });
        user.mailAddress = faker.internet.email();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
      });
    });

    describe('init password with carriage company success', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot init password of system admin', async () => {
        user.roleDiv = RoleDiv.SYSTEM_ADMIN;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot init password of kyoto spacer', async () => {
        user.roleDiv = RoleDiv.KYOTO_SPACER;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot init password of transport company role div', async () => {
        user.roleDiv = RoleDiv.TRANSPORT_COMPANY;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('cannot init password of carriage company role div in other companies', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompanyId = faker.number.int();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);

        const response = userService.initPassword(currentUser, mUserId);

        await expect(response).rejects.toBeInstanceOf(MST_USR002_007Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
      });

      it('init password of carriage company role div in same company', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompanyId = currentUser.transportCompanyId;

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
      });

      it('init password and send mail success', async () => {
        user.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        user.transportCompanyId = currentUser.transportCompanyId;
        user.mailAddress = faker.internet.email();

        const mUserFindOne = mUserRepository.findOne.mockResolvedValue(user);
        const mUserSave = mUserRepository.save.mockImplementation();

        await userService.initPassword(currentUser, mUserId);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(user.mUserId).toBe(mUserId);
        expect(mUserSave).toHaveBeenCalledTimes(1);
        expect(mUserSave).toHaveBeenCalledWith(user);
        expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
      });
    });
  });
});
