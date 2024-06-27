import { IsYYYYMMDD } from '@app/common/validators/isYYYYMMDD.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCourseBodyDto {
  @ApiProperty({ required: true, example: '2023-06-06' })
  @IsYYYYMMDD()
  @IsNotEmpty()
  serviceYmd: string;

  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  driverId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  carId?: number;
}
