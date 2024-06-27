import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateGpsActResponseDto {
  @ApiProperty({ example: '1_20230728085346602' })
  @Expose()
  gpsActKey: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
