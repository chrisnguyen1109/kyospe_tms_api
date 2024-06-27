import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCourseMemoBodyDto {
  @ApiProperty({ required: true, example: "111" })
  @IsNotEmpty()
  dummy: string;

  @ApiProperty({ required: false, example: "abc" })
  @IsOptional()
  memo?: string;
}
