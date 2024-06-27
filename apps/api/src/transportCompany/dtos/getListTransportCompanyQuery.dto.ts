import { CommonQueryDto } from '@app/common/dtos/commonQuery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetListTransportCompanyQueryDto extends CommonQueryDto([
  'transportCompanyId',
  'transportCompanyNm',
  'telNumber',
  'parentCompanyNm',
  'carriageBaseNm',
]) {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  transportCompanyId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  parentCompanyId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  baseId?: number;
}
