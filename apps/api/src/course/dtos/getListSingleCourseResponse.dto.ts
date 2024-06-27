import { DispatchStatusDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class GetListCourseSingleResponseDto {
  @ApiProperty({ example: '2018-12-23T00:00:00.000Z' })
  @Expose()
  serviceYmd: string;

  @ApiProperty({ example: '1' })
  @Expose()
  courseSeqNo: number;

  @ApiProperty({ example: 'VG5svJ6hv6' })
  @Expose()
  courseNm: string;

  @ApiProperty({ example: '運行中' })
  @Expose()
  dispatchStatusDivNm: string;

  @ApiProperty({ example: DispatchStatusDiv.CONFIRMED })
  @Expose()
  dispatchStatusDiv: DispatchStatusDiv;

  @ApiProperty({ example: '09:36:29' })
  @Expose()
  startTime: string;

  @ApiProperty({ example: '09:36:29' })
  @Expose()
  endTime: string;

  @ApiProperty({ example: true })
  @Transform(({ value }) => Boolean(Number(value)))
  @Expose()
  selectDayFlg: boolean;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
