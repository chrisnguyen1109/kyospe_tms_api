import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class SlipResponseDto {
  @ApiProperty({ example: 'JU230029240' })
  @Expose()
  slipNo: string;

  @ApiProperty({ example: 1 })
  @Expose()
  seqNo: number;

  @ApiProperty({ example: '01', nullable: true })
  @Expose()
  slipStatusDiv: SlipStatusDiv | null;

  @ApiProperty({ example: '未完了', nullable: true })
  @Expose()
  slipStatusDivNm: string | null;

  @ApiProperty({ example: '03', nullable: true })
  @Expose()
  deliveryDiv: DeliveryDiv | null;

  @ApiProperty({ example: '伝票差替', nullable: true })
  @Expose()
  deliveryDivNm: string | null;

  @ApiProperty({ example: 'course', nullable: true })
  @Expose()
  courseNo: string | null;

  @ApiProperty({ example: 'sales office', nullable: true })
  @Expose()
  salesOffice: string | null;

  @ApiProperty({ example: 'sales representative', nullable: true })
  @Expose()
  salesRepresentativeNm: string | null;

  @ApiProperty({ example: 'input staff', nullable: true })
  @Expose()
  inputStaffNm: string | null;

  @ApiProperty({ example: '2023-04-13', nullable: true })
  @Expose()
  shippingDate: Date | null;

  @ApiProperty({ example: '2023-04-13', nullable: true })
  @Expose()
  transferShippingDate: Date | null;

  @ApiProperty({ example: 'shipping warehouse', nullable: true })
  @Expose()
  shippingWarehouseNm: string | null;

  @ApiProperty({ example: 'customer', nullable: true })
  @Expose()
  customerNm: string | null;

  @ApiProperty({ example: 'site', nullable: true })
  @Expose()
  siteNm: string | null;

  @ApiProperty({ example: 'delivery destination', nullable: true })
  @Expose()
  deliveryDestinationNm: string | null;

  @ApiProperty({ example: '2023-04-13', nullable: true })
  @Expose()
  receivingDate: Date | null;

  @ApiProperty({ example: '2023-04-13', nullable: true })
  @Expose()
  transferReceivingDate: Date | null;

  @ApiProperty({ example: 'transfer staff', nullable: true })
  @Expose()
  transferStaffNm: string | null;

  @ApiProperty({ example: 'source warehouse', nullable: true })
  @Expose()
  sourceWarehouseNm: string | null;

  @ApiProperty({ example: 'source warehouse address', nullable: true })
  @Expose()
  sourceWarehouseAddress: string | null;

  @ApiProperty({ example: 'destination warehouse', nullable: true })
  @Expose()
  destinationWarehouseNm: string | null;

  @ApiProperty({ example: 'destination warehouse address', nullable: true })
  @Expose()
  destinationWarehouseAddress: string | null;

  @ApiProperty({ example: 'procurement office', nullable: true })
  @Expose()
  procurementOfficerNm: string | null;

  @ApiProperty({ example: 'supplier', nullable: true })
  @Expose()
  supplierNm: string | null;

  @ApiProperty({ example: 'pickup information', nullable: true })
  @Expose()
  pickupInformation: string | null;

  @ApiProperty({ example: 'carrier', nullable: true })
  @Expose()
  deliveryCompany: string | null;

  @ApiProperty({ example: 'factory warehouse', nullable: true })
  @Expose()
  factoryWarehouseNm: string | null;

  @ApiProperty({ example: 'remarks', nullable: true })
  @Expose()
  remarks: string | null;

  @ApiProperty({ example: '2023-04-13', nullable: true })
  @Expose()
  serviceYmd: Date | null;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  tripCount: number | null;

  @ApiProperty({ example: true })
  @Transform(({ value }) => Boolean(Number(value)))
  @Expose()
  installmentFlag: boolean;

  @ApiProperty({ example: true })
  @Transform(({ value }) => Boolean(Number(value)))
  @Expose()
  electronicSignatureImageFlg: boolean;
}
