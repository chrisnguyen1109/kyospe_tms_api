import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAssignMemoBodyDto {
  @ApiProperty({ required: true, example: 'memo' })
  @IsString()
  @IsNotEmpty()
  assignMemo: string;
}
