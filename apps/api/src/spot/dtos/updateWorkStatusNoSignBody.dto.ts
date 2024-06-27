import { StatusDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWorkStatusNoSignBodyDto {
  @ApiProperty({
    required: true,
    enum: StatusDiv,
    enumName: 'StatusDiv',
    example: StatusDiv.UNFINISHED,
  })
  @IsEnum(StatusDiv)
  @IsNotEmpty()
  statusDiv: StatusDiv;

  @ApiProperty({ required: false, example: 'memo' })
  @IsString()
  @IsOptional()
  returnMemo?: string;
}
