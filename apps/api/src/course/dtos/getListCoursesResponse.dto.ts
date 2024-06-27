import { ListResponseDto } from '@app/common/dtos/listResponse.dto';
import {
  DeliveryStatusDiv,
  DispatchStatusDiv,
} from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class CourseResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  courseId: number;

  @ApiProperty({ example: '2018-12-22T00:00:00.000Z' })
  @Expose()
  serviceYmd: Date;

  @ApiProperty({ example: '運行中' })
  @Expose()
  deliveryStatusDivNm: string;

  @ApiProperty({ example: DeliveryStatusDiv.RUNNING })
  @Expose()
  deliveryStatusDiv: DeliveryStatusDiv;

  @ApiProperty({ example: '運行中' })
  @Expose()
  dispatchStatusDivNm: string;

  @ApiProperty({ example: DispatchStatusDiv.CONFIRMED })
  @Expose()
  dispatchStatusDiv: DispatchStatusDiv;

  @ApiProperty({ example: 'courseNo' })
  @Expose()
  courseNo: string;

  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: 'transportCompanyNm' })
  @Expose()
  deliveryCompany: string;

  @ApiProperty({ example: 1 })
  @Expose()
  @Type(() => Number)
  courseCount: number;

  @ApiProperty({ example: 'carriageCompany' })
  @Expose()
  carriageCompany: string;

  @ApiProperty({ example: 1 })
  @Expose()
  driverId: number;

  @ApiProperty({ example: 'driver' })
  @Expose()
  driverNm: string;

  @ApiProperty({ example: 1 })
  @Expose()
  carId: number;

  @ApiProperty({ example: 'carNum' })
  @Expose()
  carManagementNum: string;

  @ApiProperty({ example: '2018-12-22T00:00:00.000Z' })
  @Expose()
  startTime: Date;

  @ApiProperty({ example: '2019-10-12T00:00:00.000Z' })
  @Expose()
  endTime: Date;

  @ApiProperty({ example: '100000' })
  @Expose()
  @Type(() => Number)
  highwayFee: number;

  @ApiProperty({ example: 'Tokyo' })
  @Expose()
  startPoint: string;

  @ApiProperty({ example: 'Osaka' })
  @Expose()
  arrivePoint: string;

  @ApiProperty({ example: 4 })
  @Expose()
  @Type(() => Number)
  signboardPhoto: number;

  @ApiProperty({ example: 4 })
  @Expose()
  @Type(() => Number)
  totalSlip: number;

  @ApiProperty({ example: 6 })
  @Expose()
  @Type(() => Number)
  specialDateSlip: number;

  @ApiProperty({ example: 5 })
  @Expose()
  @Type(() => Number)
  visitedCases: number;

  @ApiProperty({ example: 5 })
  @Expose()
  @Type(() => Number)
  numReturnedSlip: number;

  @ApiProperty({ example: 5 })
  @Expose()
  @Type(() => Number)
  unfinishSlip: number;
}

export class GetListCoursesResponseDto extends ListResponseDto(
  CourseResponseDto,
) {
  @ApiProperty({ example: 20, required: false })
  @Expose()
  tripNotAssigned: number;

  constructor(data: Record<string, any>) {
    super(data);
    Object.assign(this, data);
  }
}
