import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetCountImageCourseQueryDto {
  @ApiProperty({ example: '2023-02-22', required: true })
  @IsDateString()
  @IsNotEmpty()
  serviceYmdStart: string;

  @ApiProperty({ example: '2018-12-22', required: true })
  @IsDateString()
  @IsNotEmpty()
  serviceYmdEnd: string;
}
