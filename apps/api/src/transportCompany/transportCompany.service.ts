import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_TCM002_001Exception } from '@app/common/filters/exceptions/MST_TCM002_001.exception';
import { MST_TCM002_002Exception } from '@app/common/filters/exceptions/MST_TCM002_002.exception';
import { MST_TCM002_003Exception } from '@app/common/filters/exceptions/MST_TCM002_003.exception';
import { MST_TCM002_004Exception } from '@app/common/filters/exceptions/MST_TCM002_004.exception';
import {
  AbilityAction,
  ParameterSearchMappings,
} from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import { handleGetListRecords } from '@app/common/utils/handleGetListRecords';
import { omitUndefined } from '@app/common/utils/omitUndefined.util';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { Injectable } from '@nestjs/common';
import { CreateTransportCompanyBodyDto } from './dtos/createTransportCompanyBody.dto';
import { GetListTransportCompanyQueryDto } from './dtos/getListTransportCompanyQuery.dto';
import { UpdateTransportCompanyBodyDto } from './dtos/updateTransportCompanyBody.dto';

@Injectable()
export class TransportCompanyService {
  constructor(
    private readonly userAbilityFactory: UserAbilityFactory,

    private readonly mTransportCompanyRepository: MTransportCompanyRepository,
    private readonly mBaseRepository: MBaseRepository,
    private readonly mDriverRepository: MDriverRepository,
    private readonly mCarRepository: MCarRepository,
    private readonly mUserRepository: MUserRepository,
  ) {}

  async getListTransportCompanies(
    currentUser: LoginUserDto,
    listTransportCompanyQuery: GetListTransportCompanyQueryDto,
  ) {
    const { page, limit, sort, transportCompanyId, parentCompanyId, baseId } =
      listTransportCompanyQuery;

    const queryBuilder = this.mTransportCompanyRepository
      .createQueryBuilder('mTransportCompany')
      .leftJoin('mTransportCompany.parentCompany', 'parentCompany')
      .leftJoin('mTransportCompany.carriageBase', 'carriageBase')
      .select([
        'mTransportCompany.transportCompanyId as transportCompanyId',
        'mTransportCompany.transportCompanyNm as transportCompanyNm',
        'mTransportCompany.telNumber as telNumber',
        'mTransportCompany.parentCompanyId as parentCompanyId',
        'mTransportCompany.carriageBaseId as carriageBaseId',
        'parentCompany.transportCompanyNm as parentCompanyNm',
        'carriageBase.baseNmAb as carriageBaseNm',
      ]);

    switch (currentUser.roleDiv) {
      case RoleDiv.KYOTO_SPACER:
        queryBuilder.andWhere('mTransportCompany.parentCompanyId IS NULL');
        break;

      case RoleDiv.TRANSPORT_COMPANY:
      case RoleDiv.CARRIAGE_COMPANY:
        if (currentUser.transportCompanyId) {
          queryBuilder.andWhere(
            '(mTransportCompany.transportCompanyId = :transportCompanyId OR mTransportCompany.parentCompanyId = :transportCompanyId)',
            {
              transportCompanyId: currentUser.transportCompanyId,
            },
          );
        }
        break;

      default:
        break;
    }

    const parameterMappings: ParameterSearchMappings[] = [
      {
        queryParam: 'transportCompanyId',
        field: 'mTransportCompany.transportCompanyId',
        operator: '=',
        value: transportCompanyId,
      },
      {
        queryParam: 'parentCompanyId',
        field: 'mTransportCompany.parentCompanyId',
        operator: '=',
        value: parentCompanyId,
      },
      {
        queryParam: 'baseId',
        field: 'mTransportCompany.carriageBaseId',
        operator: '=',
        value: baseId,
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

  async createTransportCompany(
    currentUser: LoginUserDto,
    body: CreateTransportCompanyBodyDto,
  ) {
    const parentCompanyId = body.parentCompanyId;
    const carriageBaseId = body.carriageBaseId;
    const transportCompany = this.mTransportCompanyRepository.create(body);

    if (parentCompanyId) {
      transportCompany.parentCompany =
        await this.mTransportCompanyRepository.findOneByOrThrow(
          { transportCompanyId: parentCompanyId },
          MST_TCM002_001Exception,
          `parent company not found with transportCompanyId: ${parentCompanyId}`,
        );
    }

    if (carriageBaseId) {
      transportCompany.carriageBase =
        await this.mBaseRepository.findOneByOrThrow(
          {
            baseId: carriageBaseId,
          },
          MST_TCM002_001Exception,
          `carriage base not found with baseId: ${carriageBaseId}`,
        );
    }

    const manageTransportCompanyAbility =
      this.userAbilityFactory.defineManageTransportCompany(currentUser);

    if (
      manageTransportCompanyAbility.cannot(
        AbilityAction.CREATE,
        transportCompany,
      )
    ) {
      throw new MST_TCM002_001Exception(
        "don't have permission to create this transport company",
      );
    }

    await this.mTransportCompanyRepository.save(transportCompany);

    return transportCompany;
  }

  async updateTransportCompany(
    currentUser: LoginUserDto,
    transportCompanyId: number,
    body: UpdateTransportCompanyBodyDto,
  ) {
    const carriageBaseId = body.carriageBaseId;

    const transportCompany = await this.mTransportCompanyRepository.findOne({
      relations: {
        parentCompany: true,
        carriageBase: carriageBaseId !== null,
      },
      where: {
        transportCompanyId,
      },
    });
    if (!transportCompany) {
      throw new MST_TCM002_002Exception(
        `transport company not found with transportCompanyId: ${transportCompanyId}`,
      );
    }

    Object.assign(transportCompany, omitUndefined(body));

    if (carriageBaseId) {
      transportCompany.carriageBase =
        await this.mBaseRepository.findOneByOrThrow(
          {
            baseId: carriageBaseId,
          },
          MST_TCM002_002Exception,
          `carriage base not found with baseId: ${carriageBaseId}`,
        );
    }

    const manageTransportCompanyAbility =
      this.userAbilityFactory.defineManageTransportCompany(currentUser);

    if (
      manageTransportCompanyAbility.cannot(
        AbilityAction.UPDATE,
        transportCompany,
      )
    ) {
      throw new MST_TCM002_002Exception(
        `don't have permission to update this transport company`,
      );
    }

    await this.mTransportCompanyRepository.save(transportCompany);

    return transportCompany;
  }

  async deleteTransportCompany(
    currentUser: LoginUserDto,
    transportCompanyId: number,
  ) {
    const transportCompany = await this.mTransportCompanyRepository.findOneBy({
      transportCompanyId,
    });
    if (!transportCompany) {
      throw new MST_TCM002_003Exception(
        `transport company not found with transportCompanyId: ${transportCompanyId}`,
      );
    }

    const totalChild = await this.mTransportCompanyRepository.countBy({
      parentCompanyId: transportCompanyId,
    });
    if (totalChild > 0) {
      throw new MST_TCM002_004Exception(
        `this transport company cannot be deleted because its total child is ${totalChild}`,
      );
    }

    const manageTransportCompanyAbility =
      this.userAbilityFactory.defineManageTransportCompany(currentUser);
    if (
      manageTransportCompanyAbility.cannot(
        AbilityAction.DELETE,
        transportCompany,
      )
    ) {
      throw new MST_TCM002_003Exception(
        "don't have permission to delete this transport company",
      );
    }

    return this.mTransportCompanyRepository.remove(transportCompany);
  }

  async checkDeleteTransportCompany(transportCompanyId: number) {
    const totalChild = await this.mTransportCompanyRepository.countBy({
      parentCompanyId: transportCompanyId,
    });
    if (totalChild > 0) return false;

    const totalDriver = await this.mDriverRepository.countBy({
      transportCompanyId,
    });
    if (totalDriver > 0) return false;

    const totalCar = await this.mCarRepository.countBy({
      owningCompanyId: transportCompanyId,
    });
    if (totalCar > 0) return false;

    const totalUser = await this.mUserRepository.countBy({
      transportCompanyId,
    });
    if (totalUser > 0) return false;

    return true;
  }
}
