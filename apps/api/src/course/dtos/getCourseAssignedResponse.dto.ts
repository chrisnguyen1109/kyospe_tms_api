import { CommonSpotResponseDto } from '@app/common/dtos/commonSpotResponse.dto';
import { getAddress } from '@app/common/utils/getAddress';
import {
  getDeliveryDivNm,
  getDispatchStatusDivNm,
  getSlipStatusDivNm,
  getStatusDivNm,
  getWorkKindDivNm,
} from '@app/common/utils/getDivValueNm.util';
import { getProducts } from '@app/common/utils/getProduct.util';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class PickupDto extends CommonSpotResponseDto {}

export class GetCourseAssignedResponseDto {
  @ApiProperty({ example: 'courseSeqNo' })
  @Expose()
  courseSeqNo: string;

  @ApiProperty({ example: '2023-07-04' })
  @Expose()
  serviceYmd: string;

  @ApiProperty({ example: '2018-12-22' })
  @Expose()
  startTime: Date;

  @ApiProperty({ example: '2018-12-22' })
  @Expose()
  endTime: string;

  @ApiProperty({ example: 'courseNo' })
  @Expose()
  courseNo: string;

  @ApiProperty({ example: 'carManagementNum' })
  @Expose()
  carManagementNum: string;

  @ApiProperty({ example: 'driverNm' })
  @Expose()
  driverNm: string;

  @ApiProperty({ example: '01' })
  @Expose()
  dispatchStatusDiv: string;

  @ApiProperty({ example: 'dispatchStatusDiv' })
  @Expose()
  dispatchStatusDivNm: string;

  @ApiProperty({ example: '01' })
  @Expose()
  deliveryStatusDiv: string;

  @ApiProperty({
    isArray: true,
    type: PickupDto,
  })
  @Type(() => PickupDto)
  @Expose()
  spots: PickupDto[];

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}

export const mappingCourseAssigned = (courseRecords: any[]) => {
  return courseRecords.map(item => {
    return {
      courseSeqNo: item.courseSeqNo,
      serviceYmd: item.serviceYmd,
      startTime: item.startTime,
      endTime: item.endTime,
      courseNo: item.course?.courseNm,
      carManagementNum: item.car?.carManagementNum ?? null,
      driverNm: item.driver?.driverNm ?? null,
      dispatchStatusDiv: item.dispatchStatusDiv,
      dispatchStatusDivNm: getDispatchStatusDivNm(item.dispatchStatusDiv),
      deliveryStatusDiv: item.deliveryStatusDiv,
      spots: getSpots(item.tTrips),
    };
  });
};

const getSpots = (trips: any[]) => {
  const spots = trips.flatMap(trip => trip.tSpots);

  return spots.map(spot => {
    return {
      slipNo: spot?.trip?.tSlipHeader?.slipNo,
      seqNo: spot?.trip?.tSlipHeader?.seqNo,
      deliveryStatusDiv: spot?.trip?.tSlipHeader?.slipStatusDiv,
      deliveryStatusDivNm: getSlipStatusDivNm(
        spot?.trip?.tSlipHeader?.slipStatusDiv,
      ),
      deliveryDiv: spot?.trip?.tSlipHeader?.deliveryDiv,
      deliveryDivNm: getDeliveryDivNm(spot?.trip?.tSlipHeader?.deliveryDiv),
      remarks: spot?.trip?.tSlipHeader?.remarks ?? null,
      assignMemo: spot?.trip?.tSlipHeader?.assignMemo ?? null,
      kadaiFlg: spot?.trip?.tSlipHeader?.kadaiFlg ?? null,
      fixedFlg: spot?.fixedFlg ?? null,
      orderSlipNo: spot?.trip?.tSlipHeader?.slipNoForPurchaseOrder ?? null,
      requestDate: spot?.trip?.tSlipHeader?.requestDate ?? null,
      deliveryMemo: spot?.trip?.tSlipHeader?.deliveryMemo ?? null,
      order: spot?.order,
      purchaseOrderSlipNo:
        spot?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipNo ?? null,
      purchaseOrderDeliveryStatusDiv:
        spot?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipStatusDiv,
      purchaseOrderDeliveryStatusDivNm:
        getSlipStatusDivNm(
          spot?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipStatusDiv,
        ) ?? null,
      receivingWarehouse: spot?.trip?.receivingWarehouseBase?.baseNm1 ?? null,
      spotId: spot.spotId,
      deliveryAddress:
        getAddress(spot.address1, spot.address2, spot.address3) ?? null,
      baseNm: spot.baseNm ?? null,
      telNumber: spot.telNumber ?? null,
      workKindsDiv: spot.workKindsDiv ?? null,
      workKindsDivNm: getWorkKindDivNm(spot.workKindsDiv),
      workStatusDiv: spot.statusDiv,
      workStatusDivNm: getStatusDivNm(spot.statusDiv),
      workMemo: spot.workMemo ?? null,
      baseMemo: spot.base?.baseMemo ?? null,
      products: getProducts(
        spot?.trip?.tSlipHeader?.tSlipDetails || [],
        spot?.trip?.tSlipHeader?.deliveryDiv,
        spot?.trip?.tSlipHeader?.receivingDate,
      ),
    };
  });
};
