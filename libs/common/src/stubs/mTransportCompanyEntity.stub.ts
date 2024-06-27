import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { faker } from '@faker-js/faker';
import { abstractEntityStub } from './abstractEntity.stub';
import { plainToInstance } from 'class-transformer';

export const mTransportCompanyEntityStub = (
  props: Partial<MTransportCompanyEntity> = {},
): MTransportCompanyEntity => {
  return plainToInstance<MTransportCompanyEntity, MTransportCompanyEntity>(
    MTransportCompanyEntity,
    {
      transportCompanyId: props.transportCompanyId ?? faker.number.int(),
      transportCompanyNm: props.transportCompanyNm ?? faker.string.sample(),
      telNumber: props.telNumber,
      parentCompanyId: props.parentCompanyId,
      parentCompany: props.parentCompany,
      mTransportCompanies: props.mTransportCompanies ?? [],
      carriageBaseId: props.carriageBaseId,
      carriageBase: props.carriageBase,
      mUsers: props.mUsers ?? [],
      mDrivers: props.mDrivers ?? [],
      mCars: props.mCars ?? [],
      mCourses: props.mCourses ?? [],
      mCourseTripRelationships: props.mCourseTripRelationships ?? [],
      tCourses: props.tCourses ?? [],
      mCngTransportCompanies: props.mCngTransportCompanies ?? [],
      ...abstractEntityStub(props),
    },
  );
};
