import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTransportCompanyParamsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  transportCompanyId: number;

  @ApiProperty({ example: '櫻井運輸株式会社' })
  @Expose()
  transportCompanyNm: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
