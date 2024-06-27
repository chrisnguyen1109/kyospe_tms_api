import { IsKana } from '@app/common/validators/isKana.validator';
import { IsTelNumber } from '@app/common/validators/isTelNumber.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDriverBodyDto {
  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  transportCompanyId: number;

  @ApiProperty({ required: true, example: 'driver' })
  @IsString()
  @IsNotEmpty()
  driverNm: string;

  @ApiProperty({ required: false, example: 'ふりがな' })
  @IsKana()
  @IsOptional()
  driverNmKn: string;

  @ApiProperty({ required: false, example: '090-4754-3802' })
  @IsTelNumber()
  @IsOptional()
  telNumber?: string;

  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  carId?: number;
}
