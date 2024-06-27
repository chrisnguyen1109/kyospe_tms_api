import {
  DeliveryStatusDiv,
  DispatchStatusDiv,
} from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class GetCourseAssignedQueryDto {
  @ApiProperty({ required: false, type: [Number], example: [1, 2] })
  @Transform(({ value }) => (value instanceof Array ? value : [value]))
  @IsOptional()
  courseId?: number[];

  @ApiProperty({
    required: false,
    enum: DeliveryStatusDiv,
    enumName: 'DeliveryStatusDiv',
    example: DeliveryStatusDiv.FINISHED,
  })
  @IsEnum(DeliveryStatusDiv)
  @IsOptional()
  deliveryStatus: DeliveryStatusDiv;

  @ApiProperty({
    required: false,
    enum: DispatchStatusDiv,
    enumName: 'DispatchStatusDiv',
    example: DispatchStatusDiv.CONFIRMED,
  })
  @IsEnum(DispatchStatusDiv)
  @IsOptional()
  dispatchStatus: DispatchStatusDiv;

  @ApiProperty({ example: '2018-12-22', required: false })
  @IsDateString()
  @IsOptional()
  serviceYmd: string;

  @ApiProperty({ example: 12, required: false })
  @IsNumber()
  @IsOptional()
  startBaseId: number;
}
