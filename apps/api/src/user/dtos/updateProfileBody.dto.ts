import { SkipTrim } from '@app/common/decorators/skipTrim.decorator';
import { IsKana } from '@app/common/validators/isKana.validator';
import { IsMatch } from '@app/common/validators/isMatch.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

@SkipTrim<typeof UpdateProfileBodyDto>(
  'password',
  'newPassword',
  'confirmPassword',
)
export class UpdateProfileBodyDto {
  @ApiProperty({ required: false, example: 'user' })
  @IsString()
  @IsOptional()
  userNm?: string;

  @ApiProperty({ required: false, example: 'ふりがな' })
  @IsKana()
  @IsOptional()
  userNmKn?: string;

  @ApiProperty({ required: false, example: '123456' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false, example: '12345678' })
  @IsString()
  @IsOptional()
  newPassword?: string;

  @ApiProperty({ required: false, example: '12345678' })
  @IsMatch('newPassword')
  @IsNotEmpty()
  @ValidateIf((object: UpdateProfileBodyDto) => !!object.newPassword)
  confirmPassword?: string;

  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  mainBaseId?: number;
}
