import { AbilityAction } from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import { Subjects } from '@app/common/types/util.type';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import {
  AbilityBuilder,
  ExtractSubjectType,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import {
  FlatMCarEntity,
  FlatMDriverEntity,
  FlatMUserEntity,
  FlatTCourseEntity,
  FlatTHighwayFeeEntity,
  FlatTSpotEntity,
} from '../auth.type';

export class UserAbilityFactory {
  defineManageUser(user: Partial<MUserEntity>) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof MUserEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, MUserEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        can(AbilityAction.MANAGE, MUserEntity, {
          roleDiv: { $in: [RoleDiv.KYOTO_SPACER, RoleDiv.TRANSPORT_COMPANY] },
        });

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can(AbilityAction.MANAGE, MUserEntity, {
          roleDiv: RoleDiv.TRANSPORT_COMPANY,
          transportCompanyId: user.transportCompanyId,
        });

        can<FlatMUserEntity>(AbilityAction.MANAGE, MUserEntity, {
          roleDiv: RoleDiv.CARRIAGE_COMPANY,
          'transportCompany.parentCompanyId': user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can(AbilityAction.MANAGE, MUserEntity, {
          roleDiv: RoleDiv.CARRIAGE_COMPANY,
          transportCompanyId: user.transportCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<Subjects<typeof MUserEntity>>,
    });
  }

  defineManageTransportCompany(user: Partial<MUserEntity>) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof MTransportCompanyEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, MTransportCompanyEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        can(AbilityAction.MANAGE, MTransportCompanyEntity, {
          parentCompanyId: null,
        });

        can(AbilityAction.MANAGE, MTransportCompanyEntity, {
          parentCompanyId: undefined,
        });

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can(AbilityAction.CREATE, MTransportCompanyEntity, {
          parentCompanyId: user.transportCompanyId,
        });

        can(AbilityAction.UPDATE, MTransportCompanyEntity, {
          transportCompanyId: user.transportCompanyId,
        });

        can(AbilityAction.UPDATE, MTransportCompanyEntity, {
          parentCompanyId: user.transportCompanyId,
        });

        can(AbilityAction.DELETE, MTransportCompanyEntity, {
          parentCompanyId: user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can(AbilityAction.UPDATE, MTransportCompanyEntity, {
          transportCompanyId: user.transportCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<
          Subjects<typeof MTransportCompanyEntity>
        >,
    });
  }

  defineManageDriver(user: Partial<MUserEntity>) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof MDriverEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, MDriverEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        cannot(AbilityAction.MANAGE, MDriverEntity);

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can(AbilityAction.MANAGE, MDriverEntity, {
          transportCompanyId: user.transportCompanyId,
        });

        can<FlatMDriverEntity>(AbilityAction.MANAGE, MDriverEntity, {
          'transportCompany.parentCompanyId': user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can(AbilityAction.MANAGE, MDriverEntity, {
          transportCompanyId: user.transportCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<
          Subjects<typeof MDriverEntity>
        >,
    });
  }

  defineManageCar(user: Partial<MUserEntity>) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof MCarEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, MCarEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        cannot(AbilityAction.MANAGE, MCarEntity);

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can(AbilityAction.MANAGE, MCarEntity, {
          owningCompanyId: user.transportCompanyId,
        });

        can<FlatMCarEntity>(AbilityAction.MANAGE, MCarEntity, {
          'owningCompany.parentCompanyId': user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can(AbilityAction.MANAGE, MCarEntity, {
          owningCompanyId: user.transportCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<Subjects<typeof MCarEntity>>,
    });
  }

  defineManageCourse(
    user: Partial<MUserEntity>,
    checkByDriver: boolean = false,
  ) {
    const { can, build, cannot } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof TCourseEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, TCourseEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        cannot(AbilityAction.MANAGE, TCourseEntity);

        can(AbilityAction.READ, TCourseEntity);

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can(AbilityAction.MANAGE, TCourseEntity, {
          transportCompanyId: user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        if (checkByDriver) {
          can<FlatTCourseEntity>(AbilityAction.MANAGE, TCourseEntity, {
            'driver.transportCompanyId': user.transportCompanyId,
          });
        } else {
          can(AbilityAction.MANAGE, TCourseEntity, {
            transportCompanyId: user.parentCompanyId,
          });
        }

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<
          Subjects<typeof TCourseEntity>
        >,
    });
  }

  defineManageHighwayFee(user: Partial<MUserEntity>) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof THighwayFeeEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, THighwayFeeEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        cannot(AbilityAction.MANAGE, THighwayFeeEntity);

        can(AbilityAction.READ, THighwayFeeEntity);

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can<FlatTHighwayFeeEntity>(AbilityAction.MANAGE, THighwayFeeEntity, {
          'tCourse.transportCompanyId': user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can<FlatTHighwayFeeEntity>(AbilityAction.MANAGE, THighwayFeeEntity, {
          'tCourse.driver.transportCompanyId': user.transportCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<
          Subjects<typeof THighwayFeeEntity>
        >,
    });
  }

  defineManageSpot(user: Partial<MUserEntity>) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof TSpotEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN:
      case RoleDiv.KYOTO_SPACER: {
        can(AbilityAction.MANAGE, TSpotEntity);

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can<FlatTSpotEntity>(AbilityAction.MANAGE, TSpotEntity, {
          'trip.tCourse.transportCompanyId': user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can<FlatTSpotEntity>(AbilityAction.MANAGE, TSpotEntity, {
          'trip.tCourse.driver.transportCompanyId': user.transportCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<Subjects<typeof TSpotEntity>>,
    });
  }

  defineManageSlip(user: Partial<MUserEntity>) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[AbilityAction, Subjects<typeof TSlipHeaderEntity>]>
    >(createMongoAbility);

    switch (user.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN: {
        can(AbilityAction.MANAGE, TSlipHeaderEntity);

        break;
      }
      case RoleDiv.KYOTO_SPACER: {
        cannot(AbilityAction.MANAGE, TSlipHeaderEntity);

        can(AbilityAction.READ, TSlipHeaderEntity);

        break;
      }
      case RoleDiv.TRANSPORT_COMPANY: {
        can(AbilityAction.MANAGE, TSlipHeaderEntity, {
          carrierId: user.transportCompanyId,
        });

        break;
      }
      case RoleDiv.CARRIAGE_COMPANY: {
        can(AbilityAction.MANAGE, TSlipHeaderEntity, {
          carrierId: user.parentCompanyId,
        });

        break;
      }
    }

    return build({
      detectSubjectType: subject =>
        subject.constructor as ExtractSubjectType<
          Subjects<typeof TSlipHeaderEntity>
        >,
    });
  }
}
