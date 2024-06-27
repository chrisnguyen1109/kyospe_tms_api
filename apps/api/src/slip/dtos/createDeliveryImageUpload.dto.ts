import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryImageUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  deliveryImage: any;
}
