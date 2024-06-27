import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCourseBodyDto {
  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  startBaseId: number;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  arriveBaseId: number;
}
