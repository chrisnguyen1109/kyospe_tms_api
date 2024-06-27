import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBaseMemoBodyDto {
  @ApiProperty({ required: true, example: 'memo' })
  @IsString()
  @IsNotEmpty()
  baseMemo: string;
}
