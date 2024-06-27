import { IsTelNumber } from '@app/common/validators/isTelNumber.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransportCompanyBodyDto {
  @ApiProperty({ required: true, example: 'transport company' })
  @IsString()
  @IsNotEmpty()
  transportCompanyNm: string;

  @ApiProperty({ required: true, example: '090-4754-3802' })
  @IsTelNumber()
  @IsNotEmpty()
  telNumber: string;

  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  carriageBaseId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  parentCompanyId?: number;
}
