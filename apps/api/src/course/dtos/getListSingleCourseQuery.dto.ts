import { IsYYYYMMDD } from '@app/common/validators/isYYYYMMDD.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetListSingleCourseQueryDto {
  @IsOptional()
  @IsYYYYMMDD()
  @ApiProperty({ example: '2018-12-23', required: false })
  serviceYmd?: string;
}
