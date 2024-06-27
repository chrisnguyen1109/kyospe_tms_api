import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class CreateGpsActBodyDto {
  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseSeqNo: number;

  @ApiProperty({ required: true, example: '21.00702' })
  @IsNumberString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({ required: true, example: '105.82291' })
  @IsNumberString()
  @IsNotEmpty()
  longitude: string;
}
