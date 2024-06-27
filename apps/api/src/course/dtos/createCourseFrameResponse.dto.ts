import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateCourseFrameResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  courseSeqNo: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
