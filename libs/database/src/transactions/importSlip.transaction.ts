import {  Logger } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SlipStatusDiv,
  SpotDiv,
  StatusDiv,
  WorkKindsDiv,
} from '@app/common/types/div.type';
import {
  IfSlipType,
  SlipHeaderIf,
  SlipRecordObject,
  TripRecordObject,
} from '@batch/if/if.type';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { MBaseEntity } from '../entities/mBase.entity';
import { MCngTransportCompanyEntity } from '../entities/mCngTransportCompany.entity';
import { TSlipDeadlineEntity } from '../entities/tSlipDeadline.entity';
import { TSlipDetailEntity } from '../entities/tSlipDetail.entity';
import { TSlipHeaderEntity } from '../entities/tSlipHeader.entity';
import { TSpotEntity } from '../entities/tSpot.entity';
import { TTripEntity } from '../entities/tTrip.entity';
import { BaseTransaction } from './base.transaction';

export class ImportSlipTransaction extends BaseTransaction<
  SlipRecordObject,
  void
> {
  private readonly logger = new Logger(ImportSlipTransaction.name);
  override async execute(
    slipRecordObject: SlipRecordObject,
    manager: EntityManager,
    ifSlipType: IfSlipType,
  ) {
    const tripRecordObj: TripRecordObject = {};
    const tripKeySet = new Set<string>();
    const skipSlipNoSet = new Set<string>();

    for (const { record: headerRecord, detail } of Object.values(
      slipRecordObject,
    )) {
      const { startBaseCond, arriveBaseCond } = this.getTripBaseCond(
        ifSlipType,
        headerRecord,
      );
      const startBase = (await manager.findOneBy(
        MBaseEntity,
        startBaseCond,
      )) as MBaseEntity;
      const arriveBase = (await manager.findOneBy(
        MBaseEntity,
        arriveBaseCond,
      )) as MBaseEntity;

      if (ifSlipType !== IfSlipType.PURCHASE_ORDER) {
        const tripKey = `${headerRecord.slipNo}_${headerRecord.shippingDate?.replaceAll('/', '-')}`;

        tripRecordObj[tripKey] = {
          ifSlipType,
          slipNo: headerRecord.slipNo,
          serviceYmd: <string>headerRecord.shippingDate,
          startBase,
          arriveBase,
          deleteFlg: headerRecord.deleteFlg,
        };

        continue;
      }

      for (const { deadline } of Object.values(detail)) {
        for (const { record: deadlineRecord } of Object.values(deadline)) {
          const tripKey = `${deadlineRecord.slipNo}_${deadlineRecord.deadline?.replaceAll('/', '-')}`;

          tripRecordObj[tripKey] = {
            ifSlipType,
            slipNo: deadlineRecord.slipNo,
            serviceYmd: <string>deadlineRecord.deadline,
            startBase,
            arriveBase,
            deleteFlg: !!Math.min(
              +(tripRecordObj[tripKey]?.deleteFlg ?? deadlineRecord.deleteFlg),
              +deadlineRecord.deleteFlg,
            ),
          };
        }
      }
    }

    for (const headerValue of Object.values(slipRecordObject)) {
      const { record, detail } = headerValue;
      const {
        carrierCompany,
        deleteFlg: headerDeleteFlg,
        checkImport,
        toUpdate,
        ...headerData
      } = record;

      if (record.checkImport && !record.checkImport()) {
        skipSlipNoSet.add(record.slipNo);
        continue;
      }

      if (!carrierCompany) {
        skipSlipNoSet.add(record.slipNo);
        continue;
      }

      const cngTransportCompany = await manager.findOne(
        MCngTransportCompanyEntity,
        {
          relations: {
            transportCompany: true,
          },
          where: {
            companyCd: carrierCompany,
          },
        },
      );
      if (!cngTransportCompany) {
        skipSlipNoSet.add(record.slipNo);
        continue;
      }

      const carrierId = cngTransportCompany.transportCompanyId;
      const carrierNm = cngTransportCompany.transportCompany.transportCompanyNm;
      const kadaiFlg = cngTransportCompany.kadaiFlg;

      const existHeader = await manager.findOneBy(TSlipHeaderEntity, {
        slipNo: record.slipNo,
      });

      if (!existHeader) {
        const addHeader = await manager.save(TSlipHeaderEntity, {
          ...headerData,
          carrierId,
          carrierNm,
          kadaiFlg,
        });
        const isHeadDelete = record.deleteFlg;
        if(isHeadDelete){
          await manager.softRemove(TSlipHeaderEntity, addHeader);
        }

        for (const detailValue of Object.values(detail)) {
          const { record, deadline } = detailValue;
          const { deleteFlg, toUpdate, ...detailData } = record;

          const addDetail = await manager.save(TSlipDetailEntity, detailData);
          const isDetailDelete = isHeadDelete || record.deleteFlg;
          if(isDetailDelete){
            await manager.softRemove(TSlipDetailEntity, addDetail);
          }
    
          for (const deadlineValue of Object.values(deadline)) {
            const { record } = deadlineValue;
            const { deleteFlg, toUpdate, ...deadlineData } = record;

            const addDeadline = await manager.save(TSlipDeadlineEntity, deadlineData);
            if(isDetailDelete || record.deleteFlg){
              await manager.softRemove(TSlipDeadlineEntity, addDeadline);
            }
          }
        }
      } else {
        if (existHeader.seqNo && existHeader.seqNo > record.seqNo) {
          skipSlipNoSet.add(record.slipNo);
          continue;
        }

        const spots = await manager.find(TSpotEntity, {
          relations: {
            trip: true,
          },
          where: {
            trip: {
              slipNo: record.slipNo,
            },
          },
        });

        const checkHeaderDelete =
          headerDeleteFlg &&
          spots.every(spot => spot.statusDiv === StatusDiv.UNFINISHED);
        const checkSlipStatusDelete =
          headerDeleteFlg &&
          spots.some(spot => spot.statusDiv !== StatusDiv.UNFINISHED);

        Object.assign(existHeader, {
          ...record.toUpdate(),
          carrierId,
          carrierNm,
          kadaiFlg,
          slipStatusDiv: checkSlipStatusDelete
            ? SlipStatusDiv.DELETED
            : existHeader.slipStatusDiv,
          seqNo: record.seqNo,
        });
        await manager.save(TSlipHeaderEntity, existHeader);

        if (checkHeaderDelete) {
          await manager.softRemove(TSlipHeaderEntity, existHeader);
        }

        const existDetails = await manager.findBy(TSlipDetailEntity, {
          slipNo: record.slipNo,
        });

        const detailKeySet = new Set<string>();
        const deadlineKeySet = new Set<string>();

        for (const existDetail of existDetails) {
          const detailKey = `${existDetail.slipNo}_${record.seqNo}_${existDetail.gyoNo}`;
          const detailData = detail[detailKey];
          const checkDetailDelete =
            checkHeaderDelete || !detailData || detailData.record.deleteFlg;

          if (detailData) {
            detailKeySet.add(detailKey);

            Object.assign(existDetail, detailData.record.toUpdate());
            await manager.save(TSlipDetailEntity, existDetail);
          }

          if (checkDetailDelete) {
            await manager.softRemove(TSlipDetailEntity, existDetail);
          }

          const existDeadlines = await manager.findBy(TSlipDeadlineEntity, {
            slipNo: existDetail.slipNo,
            gyoNo: existDetail.gyoNo,
          });

          for (const existDeadline of existDeadlines) {
            const deadlineKey = `${existDeadline.slipNo}_${record.seqNo}_${existDeadline.gyoNo}_${existDeadline.deadlineNo}`;
            const deadlineData = detailData?.deadline[deadlineKey];
            const checkDeadlineDelete =
              checkDetailDelete ||
              !deadlineData ||
              deadlineData.record.deleteFlg;

            if (deadlineData) {
              deadlineKeySet.add(deadlineKey);

              Object.assign(existDeadline, deadlineData.record.toUpdate());
              await manager.save(TSlipDeadlineEntity, existDeadline);
            }

            if (checkDeadlineDelete) {
              await manager.softRemove(TSlipDeadlineEntity, existDeadline);
            }
          }
        }

        for (const [detailKey, detailValue] of Object.entries(detail)) {
          if (detailKeySet.has(detailKey)) continue;

          const { record, deadline } = detailValue;
          const {
            deleteFlg: detailDeleteFlg,
            toUpdate,
            ...detailData
          } = record;
          const checkDetailDelete = checkHeaderDelete || detailDeleteFlg;

          const newDetail = await manager.save(TSlipDetailEntity, detailData);

          if (checkDetailDelete) {
            await manager.softRemove(TSlipDetailEntity, newDetail);
          }

          for (const [deadlineKey, deadlineValue] of Object.entries(deadline)) {
            if (deadlineKeySet.has(deadlineKey)) continue;

            const {
              deleteFlg: deadlineDeleteFlg,
              toUpdate,
              ...deadlineData
            } = deadlineValue.record;

            const newDeadline = await manager.save(
              TSlipDeadlineEntity,
              deadlineData,
            );

            if (checkDetailDelete || deadlineDeleteFlg) {
              await manager.softRemove(TSlipDeadlineEntity, newDeadline);
            }
          }
        }

        const existTrips = await manager.find(TTripEntity, {
          relations: { tSpots: true },
          where: {
            slipNo: record.slipNo,
          },
        });

        for (const existTrip of existTrips) {
          const existSpot = existTrip.tSpots[0];
          const spotUnfinishStatus =
            existSpot?.statusDiv === StatusDiv.UNFINISHED;
          const tripKey = `${existTrip.slipNo}_${existTrip.serviceYmd?.replaceAll('/', '-')}`;
          const tripData = tripRecordObj[tripKey];

          if (tripData) {
            tripKeySet.add(tripKey);

            const isPurchaseOrder =
              tripData.ifSlipType === IfSlipType.PURCHASE_ORDER;
            const serviceYmd = isPurchaseOrder
              ? existTrip.serviceYmd
              : record.receivingDate;
            const courseSeqNo =
              isPurchaseOrder &&
              existSpot?.statusDiv !== StatusDiv.UNFINISHED &&
              record.receivingDate !== existTrip.serviceYmd
                ? null
                : existTrip.courseSeqNo;

            Object.assign(existTrip, {
              courseSeqNo,
              serviceYmd,
              startBase: tripData.startBase,
              arriveBase: tripData.arriveBase,
            });
            this.logger.debug(`existTrip: ${JSON.stringify(existTrip)}`)
            await manager.save(TTripEntity, existTrip);
            if (existSpot) {
              Object.assign(
                existSpot,
                this.getSpotData(ifSlipType, existTrip, true),
              );
              this.logger.log('******* save Spot 1 *******')
              await manager.save(TSpotEntity, existSpot);
            }
          }

          if (checkHeaderDelete) {
            await manager.softRemove(TTripEntity, existTrip);

            continue;
          }

          if (ifSlipType === IfSlipType.PURCHASE_ORDER) {
            const checkTripDelete =
              (!tripData || tripData.deleteFlg) && spotUnfinishStatus;

            if (checkTripDelete) {
              await manager.softRemove(TTripEntity, existTrip);
            }
          }
        }
      }
    }

    for (const [tripKey, tripValue] of Object.entries(tripRecordObj)) {
      if (tripKeySet.has(tripKey)) continue;

      if (skipSlipNoSet.has(tripValue.slipNo)) continue;

      const { ifSlipType, deleteFlg, ...tripData } = tripValue;

      if(tripValue.ifSlipType !== IfSlipType.PURCHASE_ORDER
        ){
        const existTrips = await manager.find(TTripEntity, {
          relations: { tSpots: true },
          where: {
            slipNo: tripData.slipNo,
          },
          withDeleted: true,
        });
        if(existTrips){
          const existTrip = existTrips[0];
          if(existTrip){
            Object.assign(existTrip, {
              courseSeqNo : existTrip?.serviceYmd?.replaceAll('/', '-') !== tripData.serviceYmd?.replaceAll('/', '-')
               ? null
               : existTrip.courseSeqNo,
              serviceYmd: tripData.serviceYmd,
              startBase: tripData.startBase,
              arriveBase: tripData.arriveBase,
              deleteAt: null,
            });
            this.logger.debug(`existTrip: ${JSON.stringify(existTrip)}`)
            await manager.save(TTripEntity, existTrip);

            const existSpot = existTrips[0]?.tSpots[0]
            if(existSpot){
              Object.assign(
                existSpot,
                this.getSpotData(ifSlipType, existTrip, true),
              );
              this.logger.log('******* save Spot 2 *******')
              await manager.save(TSpotEntity, existSpot);
              if (deleteFlg && existSpot.statusDiv === StatusDiv.UNFINISHED){
                await manager.softRemove(TTripEntity, existTrip);
              }
            }
          } else {
            const newTrip = await manager.save(TTripEntity, tripData);
            this.logger.log('******* save Spot 3 *******')
            await manager.save(TSpotEntity, this.getSpotData(ifSlipType, newTrip));
            if (deleteFlg){
              await manager.softRemove(TTripEntity, newTrip);
            }
          }
        } 
      } else {
        const existTrip = await manager.findOne(TTripEntity, {
          relations: { tSpots: true },
          where: {
            slipNo: tripData.slipNo,
            serviceYmd: tripData.serviceYmd,
          },
          withDeleted: true,
        });
        this.logger.debug(`existTrip: ${JSON.stringify(existTrip)}`)
        if(existTrip){
          Object.assign(existTrip, {
            courseSeqNo : existTrip?.serviceYmd?.replaceAll('/', '-') !== tripData.serviceYmd?.replaceAll('/', '-')
             ? null
             : existTrip.courseSeqNo,
            serviceYmd: tripData.serviceYmd,
            startBase: tripData.startBase,
            arriveBase: tripData.arriveBase,
            deleteAt: null,
          });
          await manager.save(TTripEntity, existTrip);

          const existSpot = existTrip.tSpots[0]
          if(existSpot){
            Object.assign(
              existSpot,
              this.getSpotData(ifSlipType, existTrip, true),
            );
            this.logger.log('******* save Spot 4 *******')
            await manager.save(TSpotEntity, existSpot);
            if (deleteFlg && existSpot.statusDiv === StatusDiv.UNFINISHED){
              await manager.softRemove(TTripEntity, existTrip);
            }
          }
        } else {
          const newTrip = await manager.save(TTripEntity, tripData);
          this.logger.log('******* save Spot 5 *******')
          await manager.save(TSpotEntity, this.getSpotData(ifSlipType, newTrip));
          if (deleteFlg){
            await manager.softRemove(TTripEntity, newTrip);
          }
        }
      }
    }
  }

  private getTripBaseCond(
    ifSlipType: IfSlipType,
    headerRecord: SlipHeaderIf,
  ): {
    startBaseCond:
      | FindOptionsWhere<MBaseEntity>
      | FindOptionsWhere<MBaseEntity>[];
    arriveBaseCond:
      | FindOptionsWhere<MBaseEntity>
      | FindOptionsWhere<MBaseEntity>[];
  } {
    const tripBaseCond = {
      [IfSlipType.ORDER]: {
        startBaseCond: {
          baseCd: headerRecord.shippingWarehouseCd,
        },
        arriveBaseCond: [
          headerRecord.deliveryDestinationCd ? (
            {
              baseCd: headerRecord.deliveryDestinationCd,
              baseEda: headerRecord.deliveryDestinationBranchNum,
            }
          ) : (
            headerRecord.siteCd ? (
              {
                baseCd: headerRecord.siteCd,
              }
            ) : (
              {
                baseCd: headerRecord.customerCd,
                baseEda: headerRecord.customerBranchNumber,
              }
            )
          )
        ],
      },
      [IfSlipType.PURCHASE_ORDER]: {
        startBaseCond: {
          baseCd: headerRecord.supplierCd,
        },
        arriveBaseCond: {
          baseCd: headerRecord.receivingWarehouseCd,
        },
      },
      [IfSlipType.TRANSFER]: {
        startBaseCond: {
          baseCd: headerRecord.sourceWarehouseCd,
        },
        arriveBaseCond: {
          baseCd: headerRecord.destinationWarehouseCd,
        },
      },
    };

    return tripBaseCond[ifSlipType];
  }

  private getSpotData(
    ifSlipType: IfSlipType,
    trip: TTripEntity,
    isUpdate: boolean = false,
  ) {
    const spotTypeObj = {
      [IfSlipType.ORDER]: {
        spotDiv: SpotDiv.DELIVERY_DESTINATION_SITE,
        base: trip.arriveBase,
        workKindsDiv: WorkKindsDiv.UNLOADING,
      },
      [IfSlipType.PURCHASE_ORDER]: {
        spotDiv: SpotDiv.SUPPLIER,
        base: trip.startBase,
        workKindsDiv: WorkKindsDiv.COLLECTION,
      },
      [IfSlipType.TRANSFER]: {
        spotDiv: SpotDiv.RECEIVING_WAREHOUSE,
        base: trip.arriveBase,
        workKindsDiv: WorkKindsDiv.UNLOADING,
      },
    };

    const typeObj = spotTypeObj[ifSlipType];

    const spotData = {
      baseId: typeObj.base?.baseId,
      baseNm: typeObj.base?.baseNm1,
      latitude: typeObj.base?.latitude,
      longitude: typeObj.base?.longitude,
      telNumber: typeObj.base?.telNumber,
      postCd: typeObj.base?.postCd,
      address1: typeObj.base?.address1,
      address2: typeObj.base?.address2,
      address3: typeObj.base?.address3,
      workKindsDiv: typeObj.workKindsDiv,
    };

    return isUpdate
      ? spotData
      : {
          trip,
          statusDiv: StatusDiv.UNFINISHED,
          spotDiv: typeObj.spotDiv,
          ...spotData,
        };
  }
}
