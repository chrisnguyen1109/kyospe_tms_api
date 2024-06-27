import { TRN_DLV003_002Exception } from '@app/common/filters/exceptions/TRN_DLV003_002.exception';
import { EntityManager } from 'typeorm';
import { TSpotEntity } from '../entities/tSpot.entity';
import { TTripEntity } from '../entities/tTrip.entity';
import { BaseTransaction } from './base.transaction';

export class UnassignSpotsTransaction extends BaseTransaction<number[], void> {
  override async execute(spotIds: number[], manager: EntityManager) {
    for (const spotId of spotIds) {
      const spot = await manager
        .findOneOrFail(TSpotEntity, {
          relations: {
            trip: {
              tSlipHeader: true,
            },
          },
          where: {
            spotId,
            fixedFlg: false,
            trip: {
              tSlipHeader: {
                fixedFlg: false,
              },
            },
          },
        })
        .catch(() => {
          throw new TRN_DLV003_002Exception(
            `spot not found with spotId: ${spotId}`,
          );
        });

      const trip = spot.trip;

      Object.assign(spot, { order: null });
      Object.assign(trip, { courseSeqNo: null });

      await Promise.all([
        manager.save(TSpotEntity, spot),
        manager.save(TTripEntity, trip),
      ]);
    }
  }
}
