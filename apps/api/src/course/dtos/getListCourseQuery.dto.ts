import { CommonQueryDto } from '@app/common/dtos/commonQuery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetListCoursesQueryDto extends CommonQueryDto([
  'serviceYmd',
  'courseId',
  'courseNo',
  'dispatchStatusDivNm',
  'deliveryStatusDivNm',
  'deliveryCompany',
  'driverNm',
  'carManagementNum',
  'specialDateSlip',
  'totalSlip',
  'visitedCases',
  'numReturnedSlip',
  'unfinishSlip',
  'startTime',
  'endTime',
  'highwayFee',
  'startPoint',
  'arrivePoint',
  'signboardPhoto',
]) {
  @ApiProperty({ example: 'JU230029240', required: false })
  @IsString()
  @IsOptional()
  slipNo?: string;

  @ApiProperty({ example: '2018-12-22', required: false })
  @IsDateString()
  @IsOptional()
  serviceStartYmd: string;

  @ApiProperty({ example: '2018-12-22', required: false })
  @IsDateString()
  @IsOptional()
  serviceEndYmd: string;

  @ApiProperty({ example: '01', required: false })
  @IsIn(['00', '01', '02', '03'])
  @IsOptional()
  serviceDivYmd: string;

  @ApiProperty({ example: 12, required: false })
  @IsNumber()
  @IsOptional()
  startBaseId: number;

  @ApiProperty({ example: 14, required: false })
  @IsNumber()
  @IsOptional()
  arriveBaseId: number;

  @ApiProperty({ example: 14, required: false })
  @IsNumber()
  @IsOptional()
  courseId: number;

  @ApiProperty({ required: false, type: [String], example: ['01', '02'] })
  @IsString({ each: true })
  @Transform(({ value }) => (value instanceof Array ? value : [value]))
  @IsOptional()
  deliveryStatus?: string[];

  @ApiProperty({ example: 'driver', required: false })
  @IsString()
  @IsOptional()
  driver: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  transportCompanyId: number;
}
