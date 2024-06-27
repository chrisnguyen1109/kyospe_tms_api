import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetCourseParamsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  courseId: number;

  @ApiProperty({ example: 'VG5svJ6hv6' })
  @Expose()
  courseNm: string;
  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: '葛飾物流センター' })
  @Expose()
  startBaseNm: string;

  @ApiProperty({ example: '葛飾物流センター' })
  @Expose()
  arriveBaseNm: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
