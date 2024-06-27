import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UnassignSpotsBodyDto {
  @ApiProperty({
    required: true,
    example: [1, 2],
  })
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  spotList: number[];
}
