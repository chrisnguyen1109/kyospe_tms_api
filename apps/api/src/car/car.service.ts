import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_CAR002_001Exception } from '@app/common/filters/exceptions/MST_CAR002_001.exception';
import { MST_CAR002_002Exception } from '@app/common/filters/exceptions/MST_CAR002_002.exception';
import { MST_CAR002_003Exception } from '@app/common/filters/exceptions/MST_CAR002_003.exception';
import {
  AbilityAction,
  ParameterSearchMappings,
} from '@app/common/types/common.type';
import { DivCd, RoleDiv } from '@app/common/types/div.type';
import { handleGetListRecords } from '@app/common/utils/handleGetListRecords';
import { omitUndefined } from '@app/common/utils/omitUndefined.util';
import { MDivValueEntity } from '@app/database/entities/mDivValue.entity';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { Injectable } from '@nestjs/common';
import { CreateCarBodyDto } from './dtos/createCarBody.dto';
import { GetListCarsQueryDto } from './dtos/getListCarsQuery.dto';
import { UpdateCarBodyDto } from './dtos/updateCarBody.dto';

@Injectable()
export class CarService {
  constructor(
    private readonly userAbilityFactory: UserAbilityFactory,

    private readonly mCarRepository: MCarRepository,
    private readonly mTransportCompanyRepository: MTransportCompanyRepository,
  ) {}

  async getListCars(
    currentUser: LoginUserDto,
    listCarQuery: GetListCarsQueryDto,
  ) {
    const {
      page,
      limit,
      sort,
      owningCompanyId,
      carType,
      carSize,
      carManagementNum,
      leaseStartYmd,
      leaseEndYmd,
    } = listCarQuery;

    const queryBuilder = this.mCarRepository
      .createQueryBuilder('mCar')
      .leftJoin('mCar.owningCompany', 'owningCompany')
      .select([
        'mCar.carId as carId',
        'mCar.carManagementNum as carManagementNum',
        'mCar.owningCompanyId as owningCompanyId',
        'mCar.leaseStartYmd as leaseStartYmd',
        'mCar.leaseEndYmd as leaseEndYmd',
        'mCar.carSize as carSize',
        'mCar.carType as carType',
        'owningCompany.transportCompanyNm as owningCompanyNm',
        'owningCompany.carriageBaseId as carriageBaseId',
      ])
      .addSelect(subQuery => {
        const carSize = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCdCarSize', {
            divCdCarSize: DivCd.CARSIZE_DIV,
          })
          .andWhere('mDivValue.divValue = mCar.carSize')
          .limit(1);
        return carSize;
      }, 'carSizeNm')
      .addSelect(subQuery => {
        const carType = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCdCarType', {
            divCdCarType: DivCd.CARTYPE_DIV,
          })
          .andWhere('mDivValue.divValue = mCar.carType')
          .limit(1);
        return carType;
      }, 'carTypeNm');

    switch (currentUser.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
      case RoleDiv.CARRIAGE_COMPANY:
        if (!currentUser.transportCompanyId) break;

        const owningCompanyIds =
          await this.mTransportCompanyRepository.getChildrenTransportCompanyIds(
            currentUser.transportCompanyId,
          );

        queryBuilder.andWhere(
          '(mCar.owningCompanyId = :owningCompanyId OR mCar.owningCompanyId IN (:...owningCompanyIds))',
          {
            owningCompanyId: currentUser.transportCompanyId,
            owningCompanyIds:
              owningCompanyIds.length > 0 ? owningCompanyIds : [null],
          },
        );
        break;
    }

    const parameterMappings: ParameterSearchMappings[] = [
      {
        queryParam: 'owningCompanyId',
        field: 'mCar.owningCompanyId',
        operator: '=',
        value: owningCompanyId,
      },
      {
        queryParam: 'carType',
        field: 'mCar.carType',
        operator: '=',
        value: carType,
      },
      {
        queryParam: 'carSize',
        field: 'mCar.carSize',
        operator: '=',
        value: carSize,
      },
      {
        queryParam: 'carManagementNum',
        field: 'mCar.carManagementNum',
        operator: 'like',
        pattern: carManagementNum,
      },
      {
        queryParam: 'leaseStartYmd',
        field: 'mCar.leaseStartYmd',
        operator: '>=',
        value: leaseStartYmd,
      },
      {
        queryParam: 'leaseEndYmd',
        field: 'mCar.leaseEndYmd',
        operator: '<=',
        value: leaseEndYmd,
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

  async createCar(currentUser: LoginUserDto, body: CreateCarBodyDto) {
    const owningCompanyId = body.owningCompanyId;
    const car = this.mCarRepository.create(body);

    car.owningCompany = await this.mTransportCompanyRepository.findOneByOrThrow(
      { transportCompanyId: owningCompanyId },
      MST_CAR002_001Exception,
      `owning company not found with transportCompanyId: ${owningCompanyId}`,
    );

    const manageCarAbility =
      this.userAbilityFactory.defineManageCar(currentUser);

    if (manageCarAbility.cannot(AbilityAction.CREATE, car)) {
      throw new MST_CAR002_001Exception(
        "don't have permission to create this car",
      );
    }

    await this.mCarRepository.save(car);

    return car;
  }

  async updateCar(
    currentUser: LoginUserDto,
    carId: number,
    body: UpdateCarBodyDto,
  ) {
    const car = await this.mCarRepository.findOne({
      relations: {
        owningCompany: true,
      },
      where: {
        carId,
      },
    });
    if (!car) {
      throw new MST_CAR002_002Exception(`car not found with carId: ${carId}`);
    }

    Object.assign(car, omitUndefined(body));

    const manageCarAbility =
      this.userAbilityFactory.defineManageCar(currentUser);

    if (manageCarAbility.cannot(AbilityAction.UPDATE, car)) {
      throw new MST_CAR002_002Exception(
        "don't have permission to update this car",
      );
    }

    await this.mCarRepository.save(car);

    return car;
  }

  async deleteCar(currentUser: LoginUserDto, carId: number) {
    const car = await this.mCarRepository.findOne({
      relations: {
        owningCompany: currentUser.roleDiv === RoleDiv.TRANSPORT_COMPANY,
      },
      where: {
        carId,
      },
    });
    if (!car) {
      throw new MST_CAR002_003Exception(`car not found with carId: ${carId}`);
    }

    const manageCarAbility =
      this.userAbilityFactory.defineManageCar(currentUser);

    if (manageCarAbility.cannot(AbilityAction.DELETE, car)) {
      throw new MST_CAR002_003Exception(
        "don't have permission to delete this car",
      );
    }

    return this.mCarRepository.remove(car);
  }
}
