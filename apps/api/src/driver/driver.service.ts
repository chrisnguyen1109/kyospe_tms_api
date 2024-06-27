import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_DRV002_001Exception } from '@app/common/filters/exceptions/MST_DRV002_001.exception';
import { MST_DRV002_002Exception } from '@app/common/filters/exceptions/MST_DRV002_002.exception';
import { MST_DRV002_003Exception } from '@app/common/filters/exceptions/MST_DRV002_003.exception';
import {
  AbilityAction,
  ParameterSearchMappings,
} from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import { handleGetListRecords } from '@app/common/utils/handleGetListRecords';
import { omitUndefined } from '@app/common/utils/omitUndefined.util';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { Injectable } from '@nestjs/common';
import { CreateDriverBodyDto } from './dtos/createDriverBody.dto';
import { GetListDriversQueryDto } from './dtos/getListDriversQuery.dto';
import { UpdateDriverBody } from './dtos/updateDriverBody.dto';

@Injectable()
export class DriverService {
  constructor(
    private readonly userAbilityFactory: UserAbilityFactory,

    private readonly mDriverRepository: MDriverRepository,
    private readonly mTransportCompanyRepository: MTransportCompanyRepository,
    private readonly mCarRepository: MCarRepository,
  ) {}

  async getListDrivers(
    currentUser: LoginUserDto,
    listDriverQuery: GetListDriversQueryDto,
  ) {
    const {
      page,
      limit,
      sort,
      transportCompanyId,
      carId,
      driverNm,
      driverNmKn,
      telNumber,
    } = listDriverQuery;

    const queryBuilder = this.mDriverRepository
      .createQueryBuilder('mDriver')
      .leftJoin('mDriver.car', 'car')
      .leftJoin('mDriver.transportCompany', 'transportCompany')
      .select([
        'mDriver.driverId as driverId',
        'mDriver.driverNm as driverNm',
        'mDriver.driverNmKn as driverNmKn',
        'mDriver.telNumber as telNumber',
        'mDriver.carId as carId',
        'mDriver.transportCompanyId as transportCompanyId',
        'car.carManagementNum as carManagementNum',
        'transportCompany.transportCompanyNm as transportCompanyNm',
      ]);

    switch (currentUser.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
      case RoleDiv.CARRIAGE_COMPANY:
        if (!currentUser.transportCompanyId) break;

        const transportCompanyIds =
          await this.mTransportCompanyRepository.getChildrenTransportCompanyIds(
            currentUser.transportCompanyId,
          );

        queryBuilder.andWhere(
          '(mDriver.transportCompanyId = :transportCompanyId OR mDriver.transportCompanyId IN (:...transportCompanyIds))',
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
        queryParam: 'transportCompanyId',
        field: 'mDriver.transportCompanyId',
        operator: '=',
        value: transportCompanyId,
      },
      {
        queryParam: 'carId',
        field: 'mDriver.carId',
        operator: '=',
        value: carId,
      },
      {
        queryParam: 'driverNm',
        field: 'mDriver.driverNm',
        operator: 'like',
        pattern: driverNm,
      },
      {
        queryParam: 'driverNmKn',
        field: 'mDriver.driverNmKn',
        operator: 'like',
        pattern: driverNmKn,
      },
      {
        queryParam: 'telNumber',
        field: 'mDriver.telNumber',
        operator: 'like',
        pattern: telNumber,
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

  async createDriver(currentUser: LoginUserDto, body: CreateDriverBodyDto) {
    const transportCompanyId = body.transportCompanyId;
    const carId = body.carId;
    const driver = this.mDriverRepository.create(body);

    driver.transportCompany =
      await this.mTransportCompanyRepository.findOneByOrThrow(
        { transportCompanyId },
        MST_DRV002_001Exception,
        `transport company not found with transportCompanyId: ${transportCompanyId}`,
      );

    if (carId) {
      const car = await this.mCarRepository.findOneByOrThrow(
        { carId },
        MST_DRV002_001Exception,
        `car not found with carId: ${carId}`,
      );

      if (car.owningCompanyId !== transportCompanyId) {
        throw new MST_DRV002_001Exception(
          `driver in transportCompanyId: ${driver.transportCompanyId} cannot assign to car in transportCompanyId: ${car.owningCompanyId}`,
        );
      }

      driver.car = car;
    }

    const manageDriverAbility =
      this.userAbilityFactory.defineManageDriver(currentUser);

    if (manageDriverAbility.cannot(AbilityAction.CREATE, driver)) {
      throw new MST_DRV002_001Exception(
        "don't have permission to create this driver",
      );
    }

    await this.mDriverRepository.save(driver);

    return driver;
  }

  async updateDriver(
    currentUser: LoginUserDto,
    driverId: number,
    body: UpdateDriverBody,
  ) {
    const transportCompanyId = body.transportCompanyId;
    const carId = body.carId;

    const driver = await this.mDriverRepository.findOne({
      relations: {
        transportCompany: true,
        car: carId !== null,
      },
      where: {
        driverId,
      },
    });
    if (!driver) {
      throw new MST_DRV002_002Exception(
        `driver not found with driverId: ${driverId}`,
      );
    }

    Object.assign(driver, omitUndefined(body));

    if (transportCompanyId) {
      driver.transportCompany =
        await this.mTransportCompanyRepository.findOneByOrThrow(
          { transportCompanyId },
          MST_DRV002_002Exception,
          `transport company not found with transportCompanyId: ${transportCompanyId}`,
        );
    }

    if (carId) {
      driver.car = await this.mCarRepository.findOneByOrThrow(
        { carId },
        MST_DRV002_002Exception,
        `car not found with carId: ${carId}`,
      );
    }

    if (
      driver.car &&
      driver.transportCompanyId !== driver.car.owningCompanyId
    ) {
      throw new MST_DRV002_002Exception(
        `driver in transportCompanyId: ${driver.transportCompanyId} cannot assign to car in transportCompanyId: ${driver.car.owningCompanyId}`,
      );
    }

    const manageDriverAbility =
      this.userAbilityFactory.defineManageDriver(currentUser);

    if (manageDriverAbility.cannot(AbilityAction.UPDATE, driver)) {
      throw new MST_DRV002_002Exception(
        "don't have permission to update this driver",
      );
    }

    await this.mDriverRepository.save(driver);

    return driver;
  }

  async deleteDriver(currentUser: LoginUserDto, driverId: number) {
    const driver = await this.mDriverRepository.findOne({
      relations: {
        transportCompany: currentUser.roleDiv === RoleDiv.TRANSPORT_COMPANY,
      },
      where: {
        driverId,
      },
    });
    if (!driver) {
      throw new MST_DRV002_003Exception(
        `driver not found with driverId: ${driverId}`,
      );
    }

    const manageDriverAbility =
      this.userAbilityFactory.defineManageDriver(currentUser);

    if (manageDriverAbility.cannot(AbilityAction.DELETE, driver)) {
      throw new MST_DRV002_003Exception(
        "don't have permission to delete this driver",
      );
    }

    return this.mDriverRepository.remove(driver);
  }
}
