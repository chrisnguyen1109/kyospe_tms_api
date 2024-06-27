import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { BaseDiv, RoleDiv } from '@app/common/types/div.type';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { Injectable } from '@nestjs/common';
import { Brackets, IsNull, Not } from 'typeorm';
import { GetDriverParamsQueryDto } from './dtos/getDriverParamsQuery.dto';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MCourseRepository } from '@app/database/repositories/mCourse.repository';
import { COM_CER001_001Exception } from '@app/common/filters/exceptions/COM_CER001_001.exception';
import { GetCarQueryDto } from './dtos/getCarQuery.dto';

@Injectable()
export class SelectService {
  constructor(
    private readonly mBaseRepository: MBaseRepository,
    private readonly mCourseRepository: MCourseRepository,
    private readonly mTransportCompanyRepository: MTransportCompanyRepository,
    private readonly mDriverRepository: MDriverRepository,
    private readonly mCarRepository: MCarRepository,
  ) {}

  async getBaseParams() {
    const bases = await this.mBaseRepository.find({
      select: ['baseId', 'baseNmAb', 'baseCd', 'sortOrder'],
      where: {
        baseDiv: BaseDiv.WAREHOUSE,
      },
    });
    
    bases.sort((a, b) => {
      if (a.sortOrder === null && b.sortOrder === null) {
        return 0;
      }
      if (a.sortOrder === null) {
        return 1;
      }
      if (b.sortOrder === null) {
        return -1;
      }
      return a.sortOrder - b.sortOrder;
    });

    return bases;
  }

  async getTransportCompanyParams(currentUser: LoginUserDto) {
    let transportCompanies: MTransportCompanyEntity[] = [];

    switch (currentUser.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN:
        transportCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;

      case RoleDiv.KYOTO_SPACER:
        transportCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          where: {
            parentCompanyId: IsNull(),
          },
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;

      case RoleDiv.TRANSPORT_COMPANY:
      case RoleDiv.CARRIAGE_COMPANY:
        if (currentUser.transportCompanyId) {
          transportCompanies = await this.mTransportCompanyRepository.find({
            select: ['transportCompanyId', 'transportCompanyNm'],
            where: [
              { transportCompanyId: currentUser.transportCompanyId },
              { parentCompanyId: currentUser.transportCompanyId },
            ],
            order: {
              transportCompanyNm: 'ASC',
            },
          });
        }
        break;

      default:
        break;
    }

    return transportCompanies;
  }

  async getParentCompanyParams(currentUser: LoginUserDto) {
    let parentCompanies: MTransportCompanyEntity[] = [];

    switch (currentUser.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN:
      case RoleDiv.KYOTO_SPACER:
        parentCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          where: {
            parentCompanyId: IsNull(),
          },
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;

      case RoleDiv.TRANSPORT_COMPANY:
        parentCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          where: {
            parentCompanyId: IsNull(),
            transportCompanyId: currentUser.transportCompanyId,
          },
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        const currentUserTransportCompany =
          await this.mTransportCompanyRepository.findOne({
            where: { transportCompanyId: currentUser.transportCompanyId },
            select: ['transportCompanyId', 'parentCompanyId'],
          });

        if (currentUserTransportCompany?.parentCompanyId) {
          parentCompanies = await this.mTransportCompanyRepository.find({
            select: ['transportCompanyId', 'transportCompanyNm'],
            where: {
              parentCompanyId: IsNull(),
              transportCompanyId: currentUserTransportCompany.parentCompanyId,
            },
            order: {
              transportCompanyNm: 'ASC',
            },
          });
        }
        break;
    }

    return parentCompanies;
  }

  async getCarriageCompanyParams(currentUser: LoginUserDto) {
    let carriageCompanies: MTransportCompanyEntity[] = [];

    switch (currentUser.roleDiv) {
      case RoleDiv.SYSTEM_ADMIN:
        carriageCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          where: {
            parentCompanyId: Not(IsNull()),
          },
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;

      case RoleDiv.TRANSPORT_COMPANY:
        carriageCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          where: {
            parentCompanyId: currentUser.transportCompanyId,
          },
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        carriageCompanies = await this.mTransportCompanyRepository.find({
          select: ['transportCompanyId', 'transportCompanyNm'],
          where: {
            transportCompanyId: currentUser.transportCompanyId,
          },
          order: {
            transportCompanyNm: 'ASC',
          },
        });
        break;
    }
    return carriageCompanies;
  }

  async getDriverParams(
    currentUser: LoginUserDto,
    driverQuery: GetDriverParamsQueryDto,
  ) {
    const { transportCompanyId, courseTransportCompanyId } = driverQuery;

    const queryBuilder = this.mDriverRepository
      .createQueryBuilder('mDriver')
      .leftJoin('mDriver.transportCompany', 'transportCompany')
      .select([
        'mDriver.driverId as driverId',
        'mDriver.driverNm as driverNm',
        'mDriver.carId as carId',
        'transportCompany.transportCompanyId as transportCompanyId',
        'transportCompany.parentCompanyId as parentCompanyId',
      ]);

    if (transportCompanyId) {
      queryBuilder.where(
        'mDriver.transportCompanyId = :transportCompanyIdQuery',
        {
          transportCompanyIdQuery: transportCompanyId,
        },
      );
    }

    if (courseTransportCompanyId) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where(
            'transportCompany.transportCompanyId = :courseTransportCompanyId',
            { courseTransportCompanyId: courseTransportCompanyId },
          ).orWhere('transportCompany.parentCompanyId = :parentCompanyId', {
            parentCompanyId: courseTransportCompanyId,
          });
        }),
      );
    }

    switch (currentUser.roleDiv) {
      case RoleDiv.KYOTO_SPACER:
        queryBuilder.andWhere('transportCompany.parentCompanyId IS NULL');
        break;

      case RoleDiv.TRANSPORT_COMPANY:
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where(
              'transportCompany.transportCompanyId = :transportCompanyId',
              { transportCompanyId: currentUser.transportCompanyId },
            ).orWhere('transportCompany.parentCompanyId = :parentCompanyId', {
              parentCompanyId: currentUser.transportCompanyId,
            });
          }),
        );
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        queryBuilder.andWhere(
          'transportCompany.transportCompanyId  = :transportCompanyId',
          { transportCompanyId: currentUser.transportCompanyId },
        );
        break;

      default:
        break;
    }

    const result = await queryBuilder.getRawMany();

    return result;
  }

  async getCarParams(currentUser: LoginUserDto, carQuery: GetCarQueryDto) {
    const { transportCompanyId, courseTransportCompanyId, carSize } = carQuery;

    const queryBuilder = this.mCarRepository
      .createQueryBuilder('mCar')
      .leftJoin('mCar.owningCompany', 'owningCompany')
      .select([
        'mCar.carId as carId',
        'mCar.carManagementNum as carManagementNum',
        'mCar.owningCompanyId as owningCompanyId',
        'owningCompany.parentCompanyId as parentCompanyId',
        'mCar.carSize as carSize',
      ]);

    if (transportCompanyId) {
      queryBuilder.where(
        'owningCompany.transportCompanyId = :transportCompanyId',
        {
          transportCompanyId,
        },
      );
    }

    if (courseTransportCompanyId) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where(
            'owningCompany.transportCompanyId = :courseTransportCompanyId',
            { courseTransportCompanyId: courseTransportCompanyId },
          ).orWhere('owningCompany.parentCompanyId = :parentCompanyId', {
            parentCompanyId: courseTransportCompanyId,
          });
        }),
      );
    }

    if (carSize) {
      queryBuilder.andWhere('mCar.carSize = :carSize', {
        carSize,
      });
    }

    switch (currentUser.roleDiv) {
      case RoleDiv.KYOTO_SPACER:
        queryBuilder.andWhere('owningCompany.parentCompanyId IS NULL');

        break;
      case RoleDiv.TRANSPORT_COMPANY:
      case RoleDiv.CARRIAGE_COMPANY:
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('owningCompany.transportCompanyId = :owningCompanyId', {
              owningCompanyId: currentUser.transportCompanyId,
            }).orWhere('owningCompany.parentCompanyId = :parentCompanyId', {
              parentCompanyId: currentUser.transportCompanyId,
            });
          }),
        );

        break;

      default:
        break;
    }

    const cars = await queryBuilder.getRawMany();

    return cars;
  }

  async getCourseParams(user: LoginUserDto) {
    const queryBuilder = this.mCourseRepository
      .createQueryBuilder('mCourse')
      .leftJoin('mCourse.startBase', 'startBase')
      .leftJoin('mCourse.arriveBase', 'arriveBase')
      .select([
        'mCourse.courseId as courseId',
        'mCourse.courseNm as courseNm',
        'mCourse.transportCompanyId as transportCompanyId',
        'startBase.baseNm1 as startBaseNm',
        'arriveBase.baseNm1 as arriveBaseNm',
      ]);

    switch (user.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
        queryBuilder.where('mCourse.transportCompanyId = :transportCompanyId', {
          transportCompanyId: user.transportCompanyId,
        });
        break;
      case RoleDiv.CARRIAGE_COMPANY:
        const userCompany =
          await this.mTransportCompanyRepository.findOneOrThrow(
            {
              where: { transportCompanyId: user.transportCompanyId },
            },
            COM_CER001_001Exception,
            'not found company of user',
          );

        queryBuilder.where('mCourse.transportCompanyId = :transportCompanyId', {
          transportCompanyId: userCompany.parentCompanyId,
        });
        break;

      default:
        break;
    }
    const courses = await queryBuilder.getRawMany();
    return courses;
  }
}
