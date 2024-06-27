import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { faker } from '@faker-js/faker';
import { BaseDiv } from '../types/div.type';
import { abstractEntityStub } from './abstractEntity.stub';
import { plainToInstance } from 'class-transformer';

export const mBaseEntityStub = (
  props: Partial<MBaseEntity> = {},
): MBaseEntity => {
  return plainToInstance<MBaseEntity, MBaseEntity>(MBaseEntity, {
    baseId: props.baseId ?? faker.number.int(),
    baseCd: props.baseCd ?? faker.location.zipCode(),
    baseEda: props.baseEda,
    baseDiv: props.baseDiv ?? faker.helpers.enumValue(BaseDiv),
    baseNm1: props.baseNm1 ?? faker.location.street(),
    baseNm2: props.baseNm2,
    baseNmAb: props.baseNmAb,
    baseNmKn: props.baseNmKn ?? faker.location.street(),
    telNumber: props.telNumber,
    latitude: props.latitude,
    longitude: props.longitude,
    prefCd: props.prefCd,
    areaDiv: props.areaDiv,
    postCd: props.postCd ?? faker.location.zipCode(),
    address1: props.address1 ?? faker.location.streetAddress(),
    address2: props.address2,
    address3: props.address3,
    baseMemo: props.baseMemo,
    mTransportCompanies: props.mTransportCompanies ?? [],
    mUsers: props.mUsers ?? [],
    startMCourses: props.startMCourses ?? [],
    arriveMCourses: props.arriveMCourses ?? [],
    startTCourses: props.startTCourses ?? [],
    arriveTCourses: props.arriveTCourses ?? [],
    startTrips: props.startTrips ?? [],
    arriveTrips: props.arriveTrips ?? [],
    tSpots: props.tSpots ?? [],
    ...abstractEntityStub(props),
  });
};
