import { CommonQueryDto } from '@app/common/dtos/commonQuery.dto';
import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetListSlipsQueryDto extends CommonQueryDto([
  'slipNo',
  'receivingDate',
  'transferReceivingDate',
  'slipStatusDiv',
  'deliveryStatusDiv',
  'salesOffice',
  'salesRepresentativeNm',
  'inputStaffNm',
  'shippingDate',
  'transferShippingDate',
  'transferStaffNm',
  'procurementOfficerNm',
  'pickupInformation',
  'deliveryCompany',
  'remarks',
  'receivingDate',
  'deliveryDiv',
  'deliveryStatus',
  'shippingWarehouseNm',
  'customerNm',
  'siteNm',
  'deliveryDestinationNm',
  'sourceWarehouseNm',
  'sourceWarehouseAddress',
  'destinationWarehouseNm',
  'destinationWarehouseAddress',
  'factoryWarehouseNm',
  'courseNo',
  'supplierNm',
  'serviceYmd',
  'electronicSignatureImageFlg',
]) {
  @ApiProperty({ example: 'JU230029240', required: false })
  @IsString()
  @IsOptional()
  slipNo?: string;

  @ApiProperty({ example: '2023-04-13', required: false })
  @IsDateString()
  @IsOptional()
  receivingDateStart?: string;

  @ApiProperty({ example: '2023-05-13', required: false })
  @IsDateString()
  @IsOptional()
  receivingDateEnd?: string;

  @ApiProperty({
    required: false,
    enum: DeliveryDiv,
    enumName: 'DeliveryDiv',
    example: DeliveryDiv.ON_SITE_DELIVERY,
  })
  @IsEnum(DeliveryDiv)
  @IsOptional()
  deliveryDiv?: DeliveryDiv;

  @ApiProperty({
    required: false,
    type: [SlipStatusDiv],
    example: [SlipStatusDiv.UNFINISHED, SlipStatusDiv.FINISHED],
  })
  @IsString({ each: true })
  @Transform(({ value }) => (value instanceof Array ? value : [value]))
  @IsOptional()
  slipStatusDiv?: SlipStatusDiv[];

  @ApiProperty({ example: 'shipping warehouse', required: false })
  @IsString()
  @IsOptional()
  shippingSourceWarehouseCd?: string;

  @ApiProperty({ example: 'delivery destination', required: false })
  @IsString()
  @IsOptional()
  deliveryDestinationNm?: string;

  @ApiProperty({ example: 'destination warehouse', required: false })
  @IsString()
  @IsOptional()
  destinationWarehouseNm?: string;

  @ApiProperty({ example: 'customer', required: false })
  @IsString()
  @IsOptional()
  customerNm?: string;

  @ApiProperty({ example: '1', required: false })
  @IsString()
  @IsOptional()
  electricSign?: string;
}
