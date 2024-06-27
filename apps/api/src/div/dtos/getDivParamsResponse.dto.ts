import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetDivParamsResponseDto {
  @ApiProperty({ example: '01' })
  @Expose()
  divValue: string;

  @ApiProperty({ example: 'システム管理者' })
  @Expose()
  divValueNm: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
