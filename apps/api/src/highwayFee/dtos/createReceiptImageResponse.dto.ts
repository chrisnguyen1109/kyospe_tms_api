import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateReceiptImageResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  imageNo: number;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
