import { SessionEntity } from '@app/database/entities/session.entity';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';

export const sessionEntityStub = (
  props: Partial<SessionEntity> = {},
): SessionEntity => {
  return plainToInstance<SessionEntity, SessionEntity>(SessionEntity, {
    sessionId: props.sessionId ?? faker.string.uuid(),
    jwtId: props.jwtId ?? faker.string.uuid(),
    mUserId: props.mUserId,
    mUser: props.mUser,
  } as SessionEntity);
};
