import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HighwayFeeResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  highwayFeeNo: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
