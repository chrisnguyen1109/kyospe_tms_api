import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetListMasterCourseResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  courseId: number;

  @ApiProperty({ example: '葛飾DC①' })
  @Expose()
  courseNm: string;

  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  startBaseId: number;

  @ApiProperty({ example: '葛飾物流センター' })
  @Expose()
  startBaseNm: string;

  @ApiProperty({ example: 1 })
  @Expose()
  arriveBaseId: number;

  @ApiProperty({ example: '葛飾物流センター' })
  @Expose()
  arriveBaseNm: string;

  @ApiProperty({ example: '09:00:00' })
  @Expose()
  serviceStartTime: string;

  @ApiProperty({ example: '18:00:00' })
  @Expose()
  serviceEndTime: string;

  @ApiProperty({ example: 1 })
  @Expose()
  charterFlg: boolean;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
