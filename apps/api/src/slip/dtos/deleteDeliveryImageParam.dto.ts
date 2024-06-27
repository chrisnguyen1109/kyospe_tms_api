import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class DeleteDeliveryImageParamDto {
  @ApiProperty({ required: true, example: 1 })
  @IsString()
  @IsNotEmpty()
  slipNo: string;

  @ApiProperty({ required: true, example: 1 })
  @IsIn([1, 2, 3, 4, 5])
  @IsNotEmpty()
  @Type(() => Number)
  imageNo: 1 | 2 | 3 | 4 | 5;
}
