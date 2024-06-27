import { CarSizeDiv, CarTypeDiv } from '@app/common/types/div.type';
import { IsYYYYMMDD } from '@app/common/validators/isYYYYMMDD.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCarBodyDto {
  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  owningCompanyId: number;

  @ApiProperty({
    required: true,
    enum: CarTypeDiv,
    enumName: 'CarTypeDiv',
    example: CarTypeDiv.TRAILER,
  })
  @IsEnum(CarTypeDiv)
  @IsNotEmpty()
  carType: CarTypeDiv;

  @ApiProperty({
    required: true,
    enum: CarSizeDiv,
    enumName: 'CarSizeDiv',
    example: CarSizeDiv['4TU'],
  })
  @IsEnum(CarSizeDiv)
  @IsNotEmpty()
  carSize: CarSizeDiv;

  @ApiProperty({ required: true, example: 'R00001' })
  @IsString()
  @IsNotEmpty()
  carManagementNum: string;

  @ApiProperty({ required: false, example: '2023-06-06' })
  @IsYYYYMMDD()
  @IsOptional()
  leaseStartYmd?: string;

  @ApiProperty({ required: false, example: '2023-06-06' })
  @IsYYYYMMDD()
  @IsOptional()
  leaseEndYmd?: string;
}
