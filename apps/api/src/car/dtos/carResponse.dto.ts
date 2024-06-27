import { CarSizeDiv, CarTypeDiv } from '@app/common/types/div.type';
import {
  getCarSizeDivNm,
  getCarTypeDivNm,
} from '@app/common/utils/getDivValueNm.util';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CarResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  carId: number;

  @ApiProperty({
    enum: CarTypeDiv,
    enumName: 'CarTypeDiv',
    example: CarTypeDiv.TRAILER,
  })
  @Expose()
  carType: CarTypeDiv;

  @ApiProperty({ example: 'トレーラー' })
  @Expose()
  @Transform(({ obj, value }) => value ?? getCarTypeDivNm(obj['carType']))
  carTypeNm: string;

  @ApiProperty({
    enum: CarSizeDiv,
    enumName: 'CarSizeDiv',
    example: CarSizeDiv['4TU'],
  })
  @Expose()
  carSize: CarSizeDiv;

  @ApiProperty({ example: '4t' })
  @Expose()
  @Transform(({ obj, value }) => value ?? getCarSizeDivNm(obj['carSize']))
  carSizeNm: string;

  @ApiProperty({ example: 'R00001' })
  @Expose()
  carManagementNum: string;

  @ApiProperty({ example: 1 })
  @Expose()
  owningCompanyId: number;

  @ApiProperty({ example: 'owning company' })
  @Transform(
    ({ obj, value }) => value ?? obj['owningCompany']?.['transportCompanyNm'],
  )
  @Expose()
  owningCompanyNm: string;

  @ApiProperty({ example: '2023-06-06', nullable: true })
  @Expose()
  leaseStartYmd?: string;

  @ApiProperty({ example: '2023-06-06', nullable: true })
  @Expose()
  leaseEndYmd?: string;

  @ApiProperty({ example: 1, nullable: true })
  @Transform(
    ({ obj, value }) =>
      value ?? obj['owningCompany']?.['carriageBaseId'] ?? null,
  )
  @Expose()
  carriageBaseId?: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
