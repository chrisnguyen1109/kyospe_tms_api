import { TRN_DLV003_001Exception } from '@app/common/filters/exceptions/TRN_DLV003_001.exception';
import { DispatchStatusDiv } from '@app/common/types/div.type';
import { EntityManager } from 'typeorm';
import { TCourseEntity } from '../entities/tCourse.entity';
import { TSpotEntity } from '../entities/tSpot.entity';
import { TTripEntity } from '../entities/tTrip.entity';
import { BaseTransaction } from './base.transaction';

export class AssignSpotsTransaction extends BaseTransaction<
  Map<number, number[]>,
  void
> {
  override async execute(
    courseList: Map<number, number[]>,
    manager: EntityManager,
  ) {
    for (const [courseSeqNo, spotIds] of courseList.entries()) {
      const course = await manager
        .findOneByOrFail(TCourseEntity, {
          courseSeqNo,
          dispatchStatusDiv: DispatchStatusDiv.UNCONFIRMED,
        })
        .catch(() => {
          throw new TRN_DLV003_001Exception(
            `course not found with courseSeqNo: ${courseSeqNo} and dispatchStatusDiv: ${DispatchStatusDiv.UNCONFIRMED}`,
          );
        });

      for (const [index, spotId] of spotIds.entries()) {
        const spot = await manager
          .findOneOrFail(TSpotEntity, {
            relations: {
              trip: true,
            },
            where: {
              spotId,
            },
          })
          .catch(() => {
            throw new TRN_DLV003_001Exception(
              `spot not found with spotId: ${spotId}`,
            );
          });

        const trip = spot.trip;

        spot.order = index + 1;
        trip.courseSeqNo = course.courseSeqNo;

        await Promise.all([
          manager.save(TSpotEntity, spot),
          manager.save(TTripEntity, trip),
        ]);
      }
    }
  }
}
