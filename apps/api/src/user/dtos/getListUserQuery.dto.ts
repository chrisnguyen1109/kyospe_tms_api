import { CommonQueryDto } from '@app/common/dtos/commonQuery.dto';
import { RoleDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetListUserQueryDto extends CommonQueryDto([
  'mUserId',
  'userId',
  'userNm',
  'userNmKn',
  'mailAddress',
  'roleDivNm',
  'mainBaseNm',
  'transportCompanyNm',
]) {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'yamaya', required: false })
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '山谷 昂寛', required: false })
  userNm?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'やまや たかひろ', required: false })
  userNmKn?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'takahiro.yamaya@nevermile.co.jp', required: false })
  mailAddress?: string;

  @IsOptional()
  @IsString()
  @IsEnum(RoleDiv)
  @ApiProperty({
    required: false,
    enum: RoleDiv,
    enumName: 'RoleDiv',
    example: RoleDiv.CARRIAGE_COMPANY,
  })
  roleDiv?: RoleDiv;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  transportCompanyId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  mainBaseId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '01', required: false })
  mainBaseNm?: string;
}
