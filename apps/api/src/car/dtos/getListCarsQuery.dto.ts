import { CommonQueryDto } from '@app/common/dtos/commonQuery.dto';
import { CarSizeDiv, CarTypeDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetListCarsQueryDto extends CommonQueryDto([
  'carId',
  'carTypeNm',
  'carSizeNm',
  'carManagementNum',
  'owningCompanyId',
  'owningCompanyNm',
  'leaseStartYmd',
  'leaseEndYmd',
  'carriageBaseId',
]) {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  owningCompanyId?: number;

  @ApiProperty({
    required: false,
    enum: CarTypeDiv,
    enumName: 'CarTypeDiv',
    example: CarTypeDiv.TRAILER,
  })
  @IsEnum(CarTypeDiv)
  @IsOptional()
  carType?: CarTypeDiv;

  @ApiProperty({
    required: false,
    enum: CarSizeDiv,
    enumName: 'CarSizeDiv',
    example: CarSizeDiv['4TU'],
  })
  @IsEnum(CarSizeDiv)
  @IsOptional()
  carSize?: CarSizeDiv;

  @ApiProperty({ example: 'R00001', required: false })
  @IsString()
  @IsOptional()
  carManagementNum?: string;

  @ApiProperty({ required: false, example: '2023-06-06' })
  @IsDateString()
  @IsOptional()
  leaseStartYmd?: string;

  @ApiProperty({ required: false, example: '2023-06-06' })
  @IsDateString()
  @IsOptional()
  leaseEndYmd?: string;
}
