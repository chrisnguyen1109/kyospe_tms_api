import { RoleDiv } from '@app/common/types/div.type';
import { getRoleDivNm } from '@app/common/utils/getDivValueNm.util';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProfileResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  mUserId: number;

  @ApiProperty({ example: 'test' })
  @Expose()
  userId: string;

  @ApiProperty({ example: 'user' })
  @Expose()
  userNm: string;

  @ApiProperty({ example: 'ふりがな' })
  @Expose()
  userNmKn: string;

  @ApiProperty({ example: 'example@gmail.com', nullable: true })
  @Expose()
  mailAddress?: string;

  @ApiProperty({
    enum: RoleDiv,
    enumName: 'RoleDiv',
    example: RoleDiv.TRANSPORT_COMPANY,
  })
  @Expose()
  roleDiv: RoleDiv;

  @ApiProperty({ example: '京都スペーサー権限' })
  @Expose()
  @Transform(({ obj, value }) => value ?? getRoleDivNm(obj['roleDiv']))
  roleDivNm: string;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  mainBaseId?: number;

  @ApiProperty({ example: 'base', nullable: true })
  @Expose()
  @Transform(({ obj, value }) => value ?? obj['mainBase']?.['baseNm1'] ?? null)
  mainBaseNm?: string;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  transportCompanyId?: number;

  @ApiProperty({ example: 'company', nullable: true })
  @Expose()
  @Transform(
    ({ obj, value }) =>
      value ?? obj['transportCompany']?.['transportCompanyNm'] ?? null,
  )
  transportCompanyNm?: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
