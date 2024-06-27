import { CarSizeDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetCarQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  transportCompanyId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  courseTransportCompanyId?: number;

  @IsOptional()
  @ApiProperty({
    example: CarSizeDiv['1.4T'],
    required: false,
    enum: CarSizeDiv,
    enumName: 'CarSizeDiv',
  })
  carSize?: string;
}
