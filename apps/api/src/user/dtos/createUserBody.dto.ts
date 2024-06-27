import { SkipTrim } from '@app/common/decorators/skipTrim.decorator';
import { RoleDiv } from '@app/common/types/div.type';
import { IsKana } from '@app/common/validators/isKana.validator';
import { IsMailFormat } from '@app/common/validators/isMailFormat.validator';
import { IsMatch } from '@app/common/validators/isMatch.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

@SkipTrim<typeof CreateUserBodyDto>('password', 'confirmPassword')
export class CreateUserBodyDto {
  @ApiProperty({ required: false, example: 'example' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object: CreateUserBodyDto) => !object.mailAddress)
  userId?: string;

  @ApiProperty({ required: false, example: 'example@gmail.com' })
  @IsMailFormat()
  @IsNotEmpty()
  @ValidateIf((object: CreateUserBodyDto) => !object.userId)
  mailAddress?: string;

  @ApiProperty({ required: true, example: 'user' })
  @IsString()
  @IsNotEmpty()
  userNm: string;

  @ApiProperty({ required: true, example: 'ふりがな' })
  @IsKana()
  @IsNotEmpty()
  userNmKn: string;

  @ApiProperty({
    required: true,
    enum: RoleDiv,
    enumName: 'RoleDiv',
    example: RoleDiv.TRANSPORT_COMPANY,
  })
  @IsEnum(RoleDiv)
  @IsNotEmpty()
  roleDiv: RoleDiv;

  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf(
    (object: CreateUserBodyDto) =>
      object.roleDiv === RoleDiv.TRANSPORT_COMPANY ||
      object.roleDiv === RoleDiv.CARRIAGE_COMPANY,
  )
  transportCompanyId?: number;

  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  mainBaseId?: number;

  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  driverId?: number;

  @ApiProperty({ required: false, example: '123456' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false, example: '123456' })
  @IsMatch('password')
  @IsNotEmpty()
  @ValidateIf((object: CreateUserBodyDto) => !!object.password)
  confirmPassword?: string;
}
