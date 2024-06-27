import { MUserEntity } from '@app/database/entities/mUser.entity';
import { RoleDiv } from '../types/div.type';
import { faker } from '@faker-js/faker';
import argon from 'argon2';
import { abstractEntityStub } from './abstractEntity.stub';
import { plainToInstance } from 'class-transformer';
import { transformLoginUser } from '../utils/transformLoginUser.util';

export const mUserEntityStub = async (
  props: Partial<MUserEntity> = {},
): Promise<MUserEntity> => {
  const password = await argon.hash(
    props.password ?? faker.internet.password(),
  );

  const user = {
    mUserId: props.mUserId ?? faker.number.int(),
    userId: props.userId ?? faker.internet.userName(),
    userNm: props.userNm ?? faker.person.fullName(),
    userNmKn: props.userNmKn ?? faker.person.fullName(),
    mailAddress: props.mailAddress,
    roleDiv: props.roleDiv ?? faker.helpers.enumValue(RoleDiv),
    password,
    mainBaseId: props.mainBaseId,
    mainBase: props.mainBase,
    transportCompanyId: props.transportCompanyId,
    transportCompany: props.transportCompany,
    sessions: props.sessions ?? [],
    driverId: props.driverId,
    driver: props.driver,
    parentCompanyId: props.parentCompanyId,
    ...abstractEntityStub(props),
  };

  return plainToInstance<MUserEntity, MUserEntity>(MUserEntity, {
    ...user,
    toLoginUser() {
      return transformLoginUser(user);
    },
  });
};
