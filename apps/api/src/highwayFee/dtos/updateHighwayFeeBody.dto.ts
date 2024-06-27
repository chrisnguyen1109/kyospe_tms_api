import { PaymentMethodDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateHighwayFeeBodyDto {
  @ApiProperty({
    required: false,
    enum: PaymentMethodDiv,
    enumName: 'PaymentMethodDiv',
    example: PaymentMethodDiv.COMPANY_PAYMENT_CASH,
  })
  @IsEnum(PaymentMethodDiv)
  @IsOptional()
  paymentMethodDiv?: PaymentMethodDiv;

  @ApiProperty({ required: false, example: 100 })
  @IsNumber()
  @IsOptional()
  amount?: number;
}
