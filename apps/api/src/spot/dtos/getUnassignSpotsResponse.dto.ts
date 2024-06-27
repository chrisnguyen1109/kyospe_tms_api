import { CommonSpotResponseDto } from '@app/common/dtos/commonSpotResponse.dto';
import { AlphabetSpot } from '@app/common/types/common.type';
import { getAddress } from '@app/common/utils/getAddress';
import {
  getDeliveryDivNm,
  getSlipStatusDivNm,
  getStatusDivNm,
  getWorkKindDivNm,
} from '@app/common/utils/getDivValueNm.util';
import { getProducts } from '@app/common/utils/getProduct.util';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetUnassignSpotResponseDto extends CommonSpotResponseDto {
  @ApiProperty({ example: true })
  @Expose()
  pickupFlg: boolean;

  @ApiProperty({ example: 'base' })
  @Expose()
  receivingWarehouseBase: string;

  @ApiProperty({ example: 'base' })
  @Expose()
  startBase: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  alphabet: string;

  constructor(data: Record<string, any>) {
    super();
    Object.assign(this, data);
  }
}

export const mappingSpotUnassign = (
  data: any,
  alphaSpot: AlphabetSpot[],
): GetUnassignSpotResponseDto => {
  const alphabet = alphaSpot.find(spot => spot.spotId === data.spotId);

  return {
    slipNo: data?.trip?.tSlipHeader?.slipNo,
    seqNo: data?.trip?.tSlipHeader?.seqNo,
    deliveryStatusDiv: data?.trip?.tSlipHeader?.slipStatusDiv,
    deliveryStatusDivNm: getSlipStatusDivNm(
      data?.trip?.tSlipHeader?.slipStatusDiv,
    ),
    deliveryDiv: data?.trip?.tSlipHeader?.deliveryDiv,
    deliveryDivNm: getDeliveryDivNm(data?.trip?.tSlipHeader?.deliveryDiv),
    remarks: data?.trip?.tSlipHeader?.remarks ?? null,
    assignMemo: data?.trip?.tSlipHeader?.assignMemo ?? null,
    orderSlipNo: data?.trip?.tSlipHeader?.slipNoForPurchaseOrder ?? null,
    kadaiFlg: data?.trip?.tSlipHeader?.kadaiFlg ?? null,
    fixedFlg: data?.fixedFlg ?? null,
    alphabet: alphabet?.alphabet ?? '',
    purchaseOrderSlipNo:
      data?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipNo ?? null,
    purchaseOrderDeliveryStatusDiv:
      data?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipStatusDiv ??
      null,
    purchaseOrderDeliveryStatusDivNm:
      getSlipStatusDivNm(
        data?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipStatusDiv,
      ) ?? null,
    pickupFlg: getPickupFlg(
      data?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.purchaseOrderTrip,
    ),
    receivingWarehouseBase: data?.trip?.receivingWarehouseBase?.baseNm1 ?? null,
    startBase: data?.trip?.startBase.baseNm1 ?? null,
    requestDate: data?.trip?.tSlipHeader?.requestDate ?? null,
    deliveryMemo: data?.trip?.tSlipHeader?.deliveryMemo ?? null,
    spotId: data.spotId,
    deliveryAddress: getAddress(data.address1, data.address2, data.address3),
    baseNm: data.baseNm ?? null,
    telNumber: data.telNumber ?? null,
    workKindsDiv: data.workKindsDiv,
    workKindsDivNm: getWorkKindDivNm(data.workKindsDiv),
    workStatusDiv: data.statusDiv,
    workStatusDivNm: getStatusDivNm(data.statusDiv),
    workMemo: data.workMemo ?? null,
    baseMemo: data.base?.baseMemo ?? null,
    products: getProducts(
      data?.trip?.tSlipHeader?.tSlipDetails || [],
      data?.trip?.tSlipHeader?.deliveryDiv,
      data?.trip?.tSlipHeader?.receivingDate,
    ),
  };
};

const getPickupFlg = (purchaseOrderTrip: TTripEntity | null): boolean => {
  if (purchaseOrderTrip?.tripId) return true;
  return false;
};
