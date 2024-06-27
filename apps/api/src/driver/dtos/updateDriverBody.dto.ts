import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, NotEquals, ValidateIf } from 'class-validator';
import { CreateDriverBodyDto } from './createDriverBody.dto';

export class UpdateDriverBody extends PartialType(CreateDriverBodyDto) {
  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @NotEquals(null)
  @ValidateIf((_, value: number) => value !== undefined)
  override transportCompanyId?: number;
}
