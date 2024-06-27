import { ApiProperty } from '@nestjs/swagger';

export class CreateReceiptImageUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  receiptImage: any;
}
