import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetDriverParamsQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  transportCompanyId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  courseTransportCompanyId?: number;
}
