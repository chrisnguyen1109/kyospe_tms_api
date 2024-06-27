import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class GetCoursesQueryDto {
  @ApiProperty({ example: '2018-12-22', required: true })
  @IsDateString()
  @IsNotEmpty()
  serviceYmd: string;

  @ApiProperty({ example: 14, required: true })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}
