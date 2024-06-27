import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UpdateLatLngBodyDto {
  @ApiProperty({ required: true, example: '21.00702' })
  @IsNumberString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({ required: true, example: '105.82291' })
  @IsNumberString()
  @IsNotEmpty()
  longitude: string;
}
