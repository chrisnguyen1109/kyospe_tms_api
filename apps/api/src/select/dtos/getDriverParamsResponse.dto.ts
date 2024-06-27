import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetDriverParamsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  driverId: number;

  @ApiProperty({ example: '島津' })
  @Expose()
  driverNm: string;

  @ApiProperty({ example: 1 })
  @Expose()
  carId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: 2 })
  @Expose()
  parentCompanyId: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
