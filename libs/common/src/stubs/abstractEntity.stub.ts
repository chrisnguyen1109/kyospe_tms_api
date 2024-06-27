import { AbstractEntity } from '@app/database/entities/abstract.entity';
import { faker } from '@faker-js/faker';

export const abstractEntityStub = (
  props: Partial<AbstractEntity> = {},
): AbstractEntity => {
  return {
    regiDatetime: props.regiDatetime ?? new Date(),
    regiPgId: props.regiPgId ?? faker.string.sample(),
    regiUserId: props.regiUserId ?? faker.number.int(),
    regiTerminalIpAddr: props.regiTerminalIpAddr ?? faker.internet.ipv4(),
    updDatetime: props.updDatetime ?? new Date(),
    updPgId: props.updPgId ?? faker.string.sample(),
    updUserId: props.updUserId ?? faker.number.int(),
    updTerminalIpAddr: props.updTerminalIpAddr ?? faker.internet.ipv4(),
  };
};
