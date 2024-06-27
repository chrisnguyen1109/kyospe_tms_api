import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { faker } from '@faker-js/faker';
import { abstractEntityStub } from './abstractEntity.stub';
import { plainToInstance } from 'class-transformer';

export const mDriverEntityStub = (
  props: Partial<MDriverEntity> = {},
): MDriverEntity => {
  return plainToInstance<MDriverEntity, MDriverEntity>(MDriverEntity, {
    driverId: props.driverId ?? faker.number.int(),
    driverNm: props.driverNm ?? faker.string.sample(),
    driverNmKn: props.driverNmKn ?? faker.string.sample(),
    telNumber: props.telNumber,
    carId: props.carId,
    car: props.car,
    transportCompanyId: props.transportCompanyId,
    transportCompany: props.transportCompany,
    mUsers: props.mUsers ?? [],
    ...abstractEntityStub(props),
  } as MDriverEntity);
};
