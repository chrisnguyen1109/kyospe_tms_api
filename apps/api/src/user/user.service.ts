import { AuthService } from '@api/auth/auth.service';
import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { AppConfigService } from '@app/app-config/appConfig.service';
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
import { MailerService } from '@app/common/services/mailer.service';
import {
  AbilityAction,
  ParameterSearchMappings,
} from '@app/common/types/common.type';
import { DivCd, RoleDiv } from '@app/common/types/div.type';
import { ClassConstructor } from '@app/common/types/util.type';
import { BaseMail } from '@app/common/utils/baseMail.util';
import { generatePassword } from '@app/common/utils/generatePassword.util';
import { handleGetListRecords } from '@app/common/utils/handleGetListRecords';
import { omitUndefined } from '@app/common/utils/omitUndefined.util';
import { MDivValueEntity } from '@app/database/entities/mDivValue.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { Injectable, Logger } from '@nestjs/common';
import argon from 'argon2';
import { CreateUserBodyDto } from './dtos/createUserBody.dto';
import { GetListUserQueryDto } from './dtos/getListUserQuery.dto';
import { UpdateProfileBodyDto } from './dtos/updateProfileBody.dto';
import { UpdateUserBodyDto } from './dtos/updateUserBody.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
    private readonly userAbilityFactory: UserAbilityFactory,

    private readonly mUserRepository: MUserRepository,
    private readonly mBaseRepository: MBaseRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly mTransportCompanyRepository: MTransportCompanyRepository,
    private readonly mDriverRepository: MDriverRepository,
  ) {}

  async getProfile(mUserId: number) {
    const user = await this.mUserRepository.findOne({
      relations: {
        mainBase: true,
        transportCompany: true,
      },
      where: {
        mUserId,
      },
    });
    if (!user) {
      throw new MST_USR003_001Exception(
        `profile not found with mUserId: ${mUserId}`,
      );
    }

    return user;
  }

  async updateProfile(
    mUserId: number,
    sessionId: string,
    body: UpdateProfileBodyDto,
  ) {
    const { password, newPassword, ...rest } = body;
    const mainBaseId = rest.mainBaseId;
    const isChangePassword = password && newPassword;

    const user = await this.mUserRepository.findOne({
      relations: {
        transportCompany: true,
        mainBase: mainBaseId !== null,
      },
      where: {
        mUserId,
      },
    });
    if (!user) {
      throw new MST_USR002_001Exception(
        `profile not found with mUserId: ${mUserId}`,
      );
    }

    const session = await this.sessionRepository.findOneBy({
      mUserId,
      sessionId,
    });
    if (!session) {
      throw new MST_USR002_001Exception(
        `session not found with mUserId: ${mUserId} and sessionId: ${sessionId}`,
      );
    }

    if (mainBaseId) {
      const base = await this.mBaseRepository.findOneBy({
        baseId: mainBaseId,
      });
      if (!base) {
        throw new MST_USR002_001Exception(
          `main base not found with baseId: ${mainBaseId}`,
        );
      }

      user.mainBase = base;
    }

    if (isChangePassword) {
      const passwordMatching = await argon.verify(user.password, password);
      if (!passwordMatching) {
        throw new MST_USR002_002Exception('incorrect password');
      }

      user.password = newPassword;

      await this.authService.logoutAllSession(mUserId);
    }

    Object.assign(user, omitUndefined(rest));

    await this.mUserRepository.save(user);

    const tokenPair = await this.authService.generateTokenPair(
      user.toLoginUser(),
      sessionId,
    );

    const accessToken = tokenPair.accessToken;
    const refreshToken = tokenPair.refreshToken;

    session.jwtId = tokenPair.rtJwtId;

    await this.sessionRepository.save(session);

    if (user.mailAddress) {
      this.mailerService
        .sendMail({
          recipients: {
            to: [{ address: user.mailAddress }],
          },
          subject: BaseMail.editAccount.subject,
          template: BaseMail.editAccount.template,
          context: {
            userNm: user.userNm,
            mailAddress: user.mailAddress,
            userId: user.userId,
            url: this.appConfigService.commonConfig.appUrl,
          },
        })
        .catch(error =>
          this.logger.error(`[updateProfile] Fail to send mail cause ${error}`),
        );
    }

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async getListUser(
    currentUser: LoginUserDto,
    listUserQuery: GetListUserQueryDto,
  ) {
    const {
      page,
      limit,
      sort,
      userId,
      userNm,
      userNmKn,
      mailAddress,
      roleDiv,
      transportCompanyId,
      mainBaseId,
      mainBaseNm,
    } = listUserQuery;

    const queryBuilder = this.mUserRepository
      .createQueryBuilder('mUser')
      .leftJoin('mUser.mainBase', 'mainBase')
      .leftJoin('mUser.transportCompany', 'transportCompany')
      .select([
        'mUser.mUserId as mUserId',
        'mUser.userId as userId',
        'mUser.userNm as userNm',
        'mUser.userNmKn as userNmKn',
        'mUser.roleDiv as roleDiv',
        'mUser.mailAddress as mailAddress',
        'mUser.mainBaseId as mainBaseId',
        'mUser.driverId as driverId',
        'mainBase.baseNm1 as mainBaseNm',
        'mUser.transportCompanyId as transportCompanyId',
        'transportCompany.transportCompanyNm as transportCompanyNm',
      ])
      .addSelect(subQuery => {
        const roleDivNm = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCd', {
            divCd: DivCd.ROLE_DIV,
          })
          .andWhere('mDivValue.divValue = mUser.roleDiv')
          .limit(1);
        return roleDivNm;
      }, 'roleDivNm');

    switch (currentUser.roleDiv) {
      case RoleDiv.KYOTO_SPACER:
        queryBuilder.andWhere('mUser.roleDiv IN (:...roles)', {
          roles: [RoleDiv.KYOTO_SPACER, RoleDiv.TRANSPORT_COMPANY],
        });
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        queryBuilder.andWhere(
          'mUser.transportCompanyId = :transportCompanyId',
          {
            transportCompanyId: currentUser.transportCompanyId,
          },
        );
        break;

      case RoleDiv.TRANSPORT_COMPANY:
        if (!currentUser.transportCompanyId) break;

        const transportCompanyIds =
          await this.mTransportCompanyRepository.getChildrenTransportCompanyIds(
            currentUser.transportCompanyId,
          );

        queryBuilder.andWhere(
          '(mUser.transportCompanyId = :transportCompanyId OR mUser.transportCompanyId IN (:...transportCompanyIds))',
          {
            transportCompanyId: currentUser.transportCompanyId,
            transportCompanyIds:
              transportCompanyIds.length > 0 ? transportCompanyIds : [null],
          },
        );
        break;

      default:
        break;
    }

    const parameterMappings: ParameterSearchMappings[] = [
      {
        queryParam: 'userId',
        field: 'mUser.userId',
        operator: 'like',
        pattern: userId,
      },
      {
        queryParam: 'userNm',
        field: 'mUser.userNm',
        operator: 'like',
        pattern: userNm,
      },
      {
        queryParam: 'userNmKn',
        field: 'mUser.userNmKn',
        operator: 'like',
        pattern: userNmKn,
      },
      {
        queryParam: 'mailAddress',
        field: 'mUser.mailAddress',
        operator: 'like',
        pattern: mailAddress,
      },
      {
        queryParam: 'roleDiv',
        field: 'mUser.roleDiv',
        operator: '=',
        value: roleDiv,
      },
      {
        queryParam: 'transportCompanyId',
        field: 'mUser.transportCompanyId',
        operator: '=',
        value: transportCompanyId,
      },
      {
        queryParam: 'mainBaseId',
        field: 'mUser.mainBaseId',
        operator: '=',
        value: mainBaseId,
      },
      {
        queryParam: 'mainBaseNm',
        field: 'mainBase.baseNm1',
        operator: 'like',
        pattern: mainBaseNm,
      },
    ];

    return handleGetListRecords(
      queryBuilder,
      parameterMappings,
      sort,
      limit,
      page,
    );
  }

  async createUser(currentUser: LoginUserDto, body: CreateUserBodyDto) {
    body.userId ??= body.mailAddress;
    const mailAddress = body.mailAddress;
    const userId = body.userId;

    if (mailAddress) {
      await this.mUserRepository.findExistAndThrow(
        { mailAddress },
        MST_USR002_008Exception,
        `mailAddress: ${mailAddress} already exists`,
      );
    }

    if (userId) {
      await this.mUserRepository.findExistAndThrow(
        { userId },
        MST_USR002_003Exception,
        `userId: ${userId} already exists`,
      );
    }

    const user = this.mUserRepository.create(body);

    if (body.transportCompanyId) {
      const transportCompany = await this.getTransportCompanyByRoleDiv(
        body.roleDiv,
        body.transportCompanyId,
        MST_USR002_004Exception,
      );

      user.transportCompany = transportCompany;
    }

    if (body.mainBaseId) {
      const mainBase = await this.mBaseRepository.findOneBy({
        baseId: body.mainBaseId,
      });
      if (!mainBase) {
        throw new MST_USR002_004Exception(
          `main base not found with baseId: ${body.mainBaseId}`,
        );
      }

      user.mainBase = mainBase;
    }

    if (body.driverId) {
      const driver = await this.mDriverRepository.findOneBy({
        driverId: body.driverId,
      });

      if (!driver) {
        throw new MST_USR002_004Exception(
          `driver not found with driverId: ${body.driverId}`,
        );
      }

      if (driver.transportCompanyId !== body.transportCompanyId) {
        throw new MST_USR002_004Exception(
          `driver with transportCompanyId: ${driver.transportCompanyId} and request transportCompanyId: ${body.transportCompanyId} does not match`,
        );
      }

      user.driver = driver;
    }

    const password = body.password ?? generatePassword();
    user.password = password;

    const manageUserAbility =
      this.userAbilityFactory.defineManageUser(currentUser);

    if (manageUserAbility.cannot(AbilityAction.CREATE, user)) {
      throw new MST_USR002_004Exception(
        "don't have permission to create this user",
      );
    }

    await this.mUserRepository.save(user);

    const mailAddressRecipient = user.mailAddress ?? currentUser.mailAddress;
    if (mailAddressRecipient) {
      this.mailerService
        .sendMail({
          recipients: {
            to: [{ address: mailAddressRecipient }],
          },
          subject: BaseMail.createAccount.subject,
          template: BaseMail.createAccount.template,
          context: {
            userNm: user.userNm,
            mailAddress: user.mailAddress,
            userId: user.userId,
            password,
            isShowPassword: !body.password,
            url: this.appConfigService.commonConfig.appUrl,
          },
        })
        .catch(error =>
          this.logger.error(`[createUser] Fail to send mail cause ${error}`),
        );
    }

    return user;
  }

  async updateUser(
    currentUser: LoginUserDto,
    mUserId: number,
    body: UpdateUserBodyDto,
  ) {
    const user = await this.mUserRepository.findOne({
      relations: {
        transportCompany: true,
        mainBase: body.mainBaseId !== null,
        driver: body.driverId !== null,
      },
      where: {
        mUserId,
      },
    });
    if (!user) {
      throw new MST_USR002_005Exception(
        `user not found with mUserId: ${mUserId}`,
      );
    }

    const manageUserAbility =
      this.userAbilityFactory.defineManageUser(currentUser);

    if (manageUserAbility.cannot(AbilityAction.UPDATE, user)) {
      throw new MST_USR002_005Exception(
        "don't have permission to update this user",
      );
    }

    Object.assign(user, omitUndefined(body));

    if (body.transportCompanyId) {
      const transportCompany = await this.getTransportCompanyByRoleDiv(
        user.roleDiv,
        body.transportCompanyId,
        MST_USR002_005Exception,
      );

      user.transportCompany = transportCompany;
    }

    if (body.transportCompanyId === null) {
      Object.assign(user, { transportCompany: null });
    }

    if (body.mainBaseId) {
      const mainBase = await this.mBaseRepository.findOneBy({
        baseId: body.mainBaseId,
      });
      if (!mainBase) {
        throw new MST_USR002_005Exception(
          `main base not found with baseId: ${body.mainBaseId}`,
        );
      }

      user.mainBase = mainBase;
    }

    if (body.driverId) {
      const driver = await this.mDriverRepository.findOneBy({
        driverId: body.driverId,
      });

      if (!driver) {
        throw new MST_USR002_005Exception(
          `driver not found with driverId: ${body.driverId}`,
        );
      }

      if (
        driver.transportCompanyId !== user.transportCompany?.transportCompanyId
      ) {
        throw new MST_USR002_005Exception(
          `driver with transportCompanyId: ${driver.transportCompanyId} and user transportCompanyId: ${user.transportCompany?.transportCompanyId} does not match`,
        );
      }

      user.driver = driver;
    }

    if (manageUserAbility.cannot(AbilityAction.UPDATE, user)) {
      throw new MST_USR002_005Exception(
        "don't have permission to update this user",
      );
    }

    await this.mUserRepository.save(user);

    const mailAddressRecipient = user.mailAddress ?? currentUser.mailAddress;
    if (mailAddressRecipient) {
      this.mailerService
        .sendMail({
          recipients: {
            to: [{ address: mailAddressRecipient }],
          },
          subject: BaseMail.editAccount.subject,
          template: BaseMail.editAccount.template,
          context: {
            userNm: user.userNm,
            mailAddress: user.mailAddress,
            userId: user.userId,
            url: this.appConfigService.commonConfig.appUrl,
          },
        })
        .catch(error =>
          this.logger.error(`[updateUser] Fail to send mail cause ${error}`),
        );
    }

    return user;
  }

  async deleteUser(currentUser: LoginUserDto, mUserId: number) {
    const user = await this.mUserRepository.findOne({
      relations: {
        transportCompany: currentUser.roleDiv === RoleDiv.TRANSPORT_COMPANY,
      },
      where: {
        mUserId,
      },
    });
    if (!user) {
      throw new MST_USR002_006Exception(
        `user not found with mUserId: ${mUserId}`,
      );
    }

    const manageUserAbility =
      this.userAbilityFactory.defineManageUser(currentUser);

    if (manageUserAbility.cannot(AbilityAction.DELETE, user)) {
      throw new MST_USR002_006Exception(
        "don't have permission to delete this user",
      );
    }

    return this.mUserRepository.remove(user);
  }

  async initPassword(currentUser: LoginUserDto, mUserId: number) {
    const user = await this.mUserRepository.findOne({
      relations: {
        transportCompany: currentUser.roleDiv === RoleDiv.TRANSPORT_COMPANY,
      },
      where: {
        mUserId,
      },
    });
    if (!user) {
      throw new MST_USR002_007Exception(
        `user not found with mUserId: ${mUserId}`,
      );
    }

    const password = generatePassword();
    user.password = password;

    const manageUserAbility =
      this.userAbilityFactory.defineManageUser(currentUser);

    if (manageUserAbility.cannot(AbilityAction.UPDATE, user)) {
      throw new MST_USR002_007Exception(
        "don't have permission to init password this user",
      );
    }

    await this.mUserRepository.save(user);

    const mailAddressRecipient = user.mailAddress ?? currentUser.mailAddress;
    if (mailAddressRecipient) {
      this.mailerService
        .sendMail({
          recipients: {
            to: [{ address: mailAddressRecipient }],
          },
          subject: BaseMail.initPassword.subject,
          template: BaseMail.initPassword.template,
          context: {
            userNm: user.userNm,
            userId: user.userId,
            password,
            url: this.appConfigService.commonConfig.appUrl,
          },
        })
        .catch(error =>
          this.logger.error(`[initPassword] Fail to send mail cause ${error}`),
        );
    }
  }

  private async getTransportCompanyByRoleDiv(
    roleDiv: RoleDiv,
    transportCompanyId: number,
    ErrorException: ClassConstructor,
  ) {
    if (roleDiv === RoleDiv.SYSTEM_ADMIN || roleDiv === RoleDiv.KYOTO_SPACER) {
      throw new ErrorException(
        'do not assign transport company to system admin or kyoto spacer role div',
      );
    }

    const transportCompany = await this.mTransportCompanyRepository.findOneBy({
      transportCompanyId,
    });

    if (!transportCompany) {
      throw new ErrorException(
        `transport company not found with transportCompanyId: ${transportCompanyId}`,
      );
    }

    if (
      roleDiv === RoleDiv.TRANSPORT_COMPANY &&
      transportCompany.parentCompanyId
    ) {
      throw new ErrorException(
        'do not assign carriage company to transport company role div',
      );
    }

    if (
      roleDiv === RoleDiv.CARRIAGE_COMPANY &&
      !transportCompany.parentCompanyId
    ) {
      throw new ErrorException(
        'do not assign transport company to carriage company role div',
      );
    }

    return transportCompany;
  }
}
