import { DeliveryStatusDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateCourseStatusBodyDto {
  @ApiProperty({
    required: true,
    enum: DeliveryStatusDiv,
    enumName: 'DeliveryStatusDiv',
    example: DeliveryStatusDiv.FINISHED,
  })
  @IsEnum(DeliveryStatusDiv)
  @IsNotEmpty()
  deliveryStatusDiv: DeliveryStatusDiv;
}
