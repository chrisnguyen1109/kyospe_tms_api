import { IsYYYYMMDD } from '@app/common/validators/isYYYYMMDD.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateStatusCourse {
  @ApiProperty({ example: '2018-12-22' })
  @IsYYYYMMDD()
  @IsNotEmpty()
  serviceYmd: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  courseId: number;
}

export class UpdateListStatusCourseBody {
  @ApiProperty({ type: [UpdateStatusCourse] })
  @ValidateNested({ each: true })
  @Type(() => UpdateStatusCourse)
  @IsNotEmpty()
  @IsArray()
  courseList: UpdateStatusCourse[];
}
