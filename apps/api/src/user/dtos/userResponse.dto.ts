import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ProfileResponseDto } from './profileResponse.dto';

export class UserResponseDto extends ProfileResponseDto {
  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  driverId?: number;

  @ApiProperty({ example: 'driver', nullable: true })
  @Expose()
  @Transform(({ obj, value }) => value ?? obj['driver']?.['driverNm'] ?? null)
  driverNm?: string;

  constructor(data: Record<string, any>) {
    super(data);

    Object.assign(this, data);
  }
}
