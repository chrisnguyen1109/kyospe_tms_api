import { ApiProperty } from '@nestjs/swagger';

export class LoginBodyDto {
  @ApiProperty({
    required: true,
    example: 'test',
  })
  loginId: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  password: string;
}
