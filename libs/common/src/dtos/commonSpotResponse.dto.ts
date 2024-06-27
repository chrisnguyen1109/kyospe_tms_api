import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class DeadlineDto {
  @ApiProperty({ example: 'deadline' })
  @Expose()
  deadline: string;
}

export class ProductDto {
  @ApiProperty({ example: 1 })
  @Expose()
  gyoNo: number;

  @ApiProperty({ example: 'productNm' })
  @Expose()
  productNm?: string;

  @ApiProperty({ example: 'size' })
  @Expose()
  size?: string;

  @ApiProperty({ example: 50 })
  @Expose()
  quantityPerCase?: number;

  @ApiProperty({ example: '10.0' })
  @Expose()
  numberOfCases?: string;

  @ApiProperty({ example: 'unitPerCase' })
  @Expose()
  unitPerCase?: string;

  @ApiProperty({ example: '10.0' })
  @Expose()
  numberOfItems?: string;

  @ApiProperty({ example: 'unitPerItem' })
  @Expose()
  unitPerItem?: string;

  @ApiProperty({ example: '10.0' })
  @Expose()
  totalNumber?: string;

  @ApiProperty({ example: 'remarks' })
  @Expose()
  remarks?: string;

  @ApiProperty({ example: '2000-11-30T22:55:45.000Z' })
  @Expose()
  deleteAt?: Date;

  @ApiProperty({
    example: '2000-11-30',
  })
  @Expose()
  deadline: string | null;
}

export class CommonSpotResponseDto {
  @ApiProperty({ example: '01' })
  @Expose()
  slipNo: string;

  @ApiProperty({ example: 1 })
  @Expose()
  seqNo: number;

  @ApiProperty({ example: '02' })
  @Expose()
  deliveryStatusDiv: string;

  @ApiProperty({ example: 'deliveryStatusDivNm' })
  @Expose()
  deliveryStatusDivNm: string;

  @ApiProperty({ example: '01' })
  @Expose()
  deliveryDiv: string;

  @ApiProperty({ example: 'deliveryDivNm' })
  @Expose()
  deliveryDivNm: string;

  @ApiProperty({ example: 'システム管理者' })
  @Expose()
  remarks: string;

  @ApiProperty({ example: 'assignMemo' })
  @Expose()
  assignMemo: string;

  @ApiProperty({ example: 'kadaiFlg' })
  @Expose()
  kadaiFlg: boolean;

  @ApiProperty({ example: 'orderSlipNo' })
  @Expose()
  orderSlipNo: string;

  @ApiProperty({ example: 'base' })
  @Expose()
  receivingWarehouse?: string;

  @ApiProperty({ example: '2023-07-08' })
  @Expose()
  requestDate?: string;

  @ApiProperty({ example: 'delivery memo' })
  @Expose()
  deliveryMemo?: string;

  @ApiProperty({ example: 1 })
  @Expose()
  order?: number;

  @ApiProperty({ example: 'purchaseOrderSlipNo' })
  @Expose()
  purchaseOrderSlipNo: string;

  @ApiProperty({ example: '02' })
  @Expose()
  purchaseOrderDeliveryStatusDiv: string;

  @ApiProperty({ example: 'purchaseOrderDeliveryStatusDiv' })
  @Expose()
  purchaseOrderDeliveryStatusDivNm: string;

  @ApiProperty({ example: 1 })
  @Expose()
  spotId: number;

  @ApiProperty({ example: 'deliveryAddress' })
  @Expose()
  deliveryAddress: string;

  @ApiProperty({ example: 'baseNm' })
  @Expose()
  baseNm: string;

  @ApiProperty({ example: 'telNumber' })
  @Expose()
  telNumber: string;

  @ApiProperty({ example: 'workKindDiv' })
  @Expose()
  workKindsDiv: string;

  @ApiProperty({ example: 'workKindDivNm' })
  @Expose()
  workKindsDivNm: string;

  @ApiProperty({ example: 'workStatusDiv' })
  @Expose()
  workStatusDiv: string;

  @ApiProperty({ example: 'workStatusDivNm' })
  @Expose()
  workStatusDivNm: string;

  @ApiProperty({ example: 'workMemo' })
  @Expose()
  workMemo: string;

  @ApiProperty({ example: 'baseMemo' })
  @Expose()
  baseMemo: string;

  @ApiProperty({ example: 'fixedFlg' })
  @Expose()
  fixedFlg: boolean;

  @ApiProperty({
    isArray: true,
    type: ProductDto,
  })
  @Type(() => ProductDto)
  @Expose()
  products: ProductDto[];
}
