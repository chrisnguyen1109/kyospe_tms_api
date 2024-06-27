import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CustomErrorDto {
  @ApiProperty({ example: 'COM_COM001_001' })
  code: string;

  @ApiProperty({ example: '不明なエラーが発生しました', nullable: true })
  message?: string;

  @ApiProperty({
    example: 'Unexpected token } in JSON at position 212',
    nullable: true,
  })
  detail?: any;
}

export class ErrorResponseDto {
  @ApiProperty({
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode: HttpStatus;

  @ApiProperty({ example: 'Error' })
  message: string;

  @ApiProperty({ type: [CustomErrorDto] })
  @Type(() => CustomErrorDto)
  errors: CustomErrorDto[];
}
