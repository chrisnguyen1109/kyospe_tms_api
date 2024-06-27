import { CommonQueryDto } from '@app/common/dtos/commonQuery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetListDriversQueryDto extends CommonQueryDto([
  'driverId',
  'driverNm',
  'driverNmKn',
  'telNumber',
  'carId',
  'carManagementNum',
  'transportCompanyId',
  'transportCompanyNm',
]) {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  transportCompanyId?: number;

  @ApiProperty({ example: '関根太郎', required: false })
  @IsString()
  @IsOptional()
  driverNm?: string;

  @ApiProperty({ example: 'せきねたろう', required: false })
  @IsString()
  @IsOptional()
  driverNmKn?: string;

  @ApiProperty({ example: '090-4754-3802', required: false })
  @IsString()
  @IsOptional()
  telNumber?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  carId?: number;
}
