import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImageDto {
  @ApiProperty({ example: 'https://image.com' })
  @Expose()
  url: string;
}
