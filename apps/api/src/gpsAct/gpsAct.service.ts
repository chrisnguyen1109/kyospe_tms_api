import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { TRN_CRS018_001Exception } from '@app/common/filters/exceptions/TRN_CRS018_001.exception';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { TGpsActRepository } from '@app/database/repositories/tGpsAct.repository';
import { GoogleService } from '@app/google/google.service';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { CreateGpsActBodyDto } from './dtos/createGpsActBody.dto';
import { OrderBy } from '@app/common/types/common.type';

@Injectable()
export class GpsActService {
  constructor(
    private readonly googleService: GoogleService,

    private readonly tGpsActRepository: TGpsActRepository,
    private readonly tCourseRepository: TCourseRepository,
  ) {}

  async createGpsAct(currentUser: LoginUserDto, body: CreateGpsActBodyDto) {
    const { courseSeqNo, latitude, longitude } = body;

    await this.tCourseRepository.findOneByOrThrow(
      {
        courseSeqNo,
        driverId: currentUser.driverId,
      },
      TRN_CRS018_001Exception,
      `course not found with courseSeqNo: ${courseSeqNo}`,
    );

    const latestGpsAct = await this.tGpsActRepository.findOne({
      where: {
        courseSeqNo,
      },
      order: {
        updDatetime: OrderBy.DESC,
      },
    });
    const currentTimeMoment = moment();
    let distance: number = 0;

    if (latestGpsAct) {
      if (
        moment(latestGpsAct.updDatetime)
          .add(1, 'minute')
          .isSameOrAfter(currentTimeMoment)
      ) {
        return latestGpsAct;
      }

      const origin =
        `${latestGpsAct.latitude},${latestGpsAct.longitude}` as const;
      const destination = `${latitude},${longitude}` as const;
      const departure_time = currentTimeMoment.add(1, 'minute').valueOf();

      const response = await this.googleService.getDirections({
        origin,
        destination,
        departure_time,
      });
      if (response.status !== 'OK') {
        throw new TRN_CRS018_001Exception(
          'Cannot get directions from google api',
        );
      }

      distance = response.routes.reduce(
        (prevRoute, curRoute) =>
          prevRoute +
          curRoute.legs.reduce(
            (prevLog, curLeg) => prevLog + (curLeg.distance?.value ?? 0),
            0,
          ),
        0,
      );
    }

    const gpsAct = this.tGpsActRepository.create({
      gpsActKey: `${courseSeqNo}_${currentTimeMoment.format(
        'YYYYMMDDHHmmssSSS',
      )}`,
      courseSeqNo,
      latitude,
      longitude,
      distance,
    });

    return this.tGpsActRepository.save(gpsAct);
  }
}
