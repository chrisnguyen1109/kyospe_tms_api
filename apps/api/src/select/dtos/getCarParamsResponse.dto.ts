import { CarSizeDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetCarParamsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  carId: number;

  @ApiProperty({ example: '明治鋼' })
  @Expose()
  carManagementNum: string;

  @ApiProperty({ example: 1 })
  @Expose()
  owningCompanyId: string;

  @ApiProperty({ example: 1 })
  @Expose()
  parentCompanyId: string;

  @ApiProperty({
    example: CarSizeDiv['1.4T'],
    enum: CarSizeDiv,
    enumName: 'CarSizeDiv',
  })
  @Expose()
  carSize: CarSizeDiv;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
