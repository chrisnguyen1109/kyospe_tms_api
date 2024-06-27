import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetBaseParamsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  baseId: number;

  @ApiProperty({ example: '明治鋼業 第一工場' })
  @Expose({ name: 'baseNm' })
  baseNmAb: string;

  @ApiProperty({ example: 'basCd' })
  @Expose()
  baseCd: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
