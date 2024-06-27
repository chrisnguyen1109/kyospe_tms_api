import { IsYYYYMMDD } from '@app/common/validators/isYYYYMMDD.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DownloadSignboardPhotosQuery {
  @ApiProperty({ example: '2023-06-27', required: true })
  @IsYYYYMMDD()
  @IsNotEmpty()
  serviceYmdFrom: string;

  @ApiProperty({ example: '2023-07-27', required: true })
  @IsYYYYMMDD()
  @IsNotEmpty()
  serviceYmdTo: string;
}
