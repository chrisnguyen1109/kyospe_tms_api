import { IsMailFormat } from '@app/common/validators/isMailFormat.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordBodyDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsMailFormat()
  @IsNotEmpty()
  mailAddress: string;
}
