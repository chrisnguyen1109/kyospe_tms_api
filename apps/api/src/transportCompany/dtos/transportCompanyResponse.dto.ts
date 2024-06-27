import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class TransportCompanyResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: 'transport company' })
  @Expose()
  transportCompanyNm: string;

  @ApiProperty({ example: '090-4754-3802', nullable: true })
  @Expose()
  telNumber?: string;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  parentCompanyId?: number;

  @ApiProperty({ example: 'parent company', nullable: true })
  @Transform(
    ({ obj, value }) =>
      value ?? obj['parentCompany']?.['transportCompanyNm'] ?? null,
  )
  @Expose()
  parentCompanyNm?: string;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  carriageBaseId?: number;

  @ApiProperty({ example: 'carriage base', nullable: true })
  @Transform(
    ({ obj, value }) => value ?? obj['carriageBase']?.['baseNmAb'] ?? null,
  )
  @Expose()
  carriageBaseNm?: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
