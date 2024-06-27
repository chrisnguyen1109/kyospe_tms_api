import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetCountImageCourseResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  countImage: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
