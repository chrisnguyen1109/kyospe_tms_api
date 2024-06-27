import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class DriverResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  driverId: number;

  @ApiProperty({ example: 'driver' })
  @Expose()
  driverNm: string;

  @ApiProperty({ example: 'ふりがな', nullable: true })
  @Expose()
  driverNmKn?: string;

  @ApiProperty({ example: '090-4754-3802', nullable: true })
  @Expose()
  telNumber?: string;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  carId?: number;

  @ApiProperty({ example: 'R00001', nullable: true })
  @Transform(
    ({ obj, value }) => value ?? obj['car']?.['carManagementNum'] ?? null,
  )
  @Expose()
  carManagementNum?: string;

  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: 'transport company' })
  @Transform(
    ({ obj, value }) =>
      value ?? obj['transportCompany']?.['transportCompanyNm'],
  )
  @Expose()
  transportCompanyNm: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
