import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListMasterCourseQueryDto {
  @ApiProperty({ example: true, type: 'boolean', required: false })
  @IsOptional()
  @IsString()
  signFlg?: string;
}
