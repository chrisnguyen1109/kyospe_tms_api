import { faker } from '@faker-js/faker';
import { abstractEntityStub } from './abstractEntity.stub';
import { plainToInstance } from 'class-transformer';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { CarSizeDiv, CarTypeDiv } from '../types/div.type';

export const mCarEntityStub = (props: Partial<MCarEntity> = {}): MCarEntity => {
  return plainToInstance<MCarEntity, MCarEntity>(MCarEntity, {
    carId: props.carId ?? faker.number.int(),
    carType: props.carType ?? faker.helpers.enumValue(CarTypeDiv),
    carSize: props.carSize ?? faker.helpers.enumValue(CarSizeDiv),
    carManagementNum: props.carManagementNum ?? faker.string.sample(),
    leaseStartYmd: props.leaseStartYmd,
    leaseEndYmd: props.leaseEndYmd,
    owningCompanyId: props.owningCompanyId,
    owningCompany: props.owningCompany,
    mDrivers: props.mDrivers ?? [],
    ...abstractEntityStub(props),
  } as MCarEntity);
};
