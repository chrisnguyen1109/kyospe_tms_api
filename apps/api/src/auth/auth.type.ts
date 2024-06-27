import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends LoginUserDto {}

    interface Request {
      sessionId?: string;
      user?: LoginUserDto;
    }
  }
}

export enum StrategyName {
  LOCAL = 'local',
  JWT_AT = 'jwt-at',
  JWT_RT = 'jwt-rt',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

export interface RefreshTokenPayload {
  mUserId: number;
  sessionId: string;
  jti: string;
}

export type FlatMUserEntity = MUserEntity & {
  'transportCompany.parentCompanyId': number;
};

export type FlatMDriverEntity = MDriverEntity & {
  'transportCompany.parentCompanyId': number;
};

export type FlatMCarEntity = MCarEntity & {
  'owningCompany.parentCompanyId': number;
};

export type FlatTCourseEntity = TCourseEntity & {
  'driver.transportCompanyId': number;
};

export type FlatTHighwayFeeEntity = THighwayFeeEntity & {
  'tCourse.transportCompanyId': number;
  'tCourse.driver.transportCompanyId': number;
};

export type FlatTSpotEntity = TSpotEntity & {
  'trip.tCourse.transportCompanyId': number;
  'trip.tCourse.driver.transportCompanyId': number;
};
