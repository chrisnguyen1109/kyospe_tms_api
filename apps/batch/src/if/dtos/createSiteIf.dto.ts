import { BaseDiv } from '@app/common/types/div.type';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateMBaseIf, MBaseIf } from '../if.type';

export class CreateSiteIfDto implements CreateMBaseIf {
  @MaxLengthI18n(20, { name: '現場コード' })
  @IsStringI18n({ name: '現場コード' })
  @IsNotEmptyI18n({ name: '現場コード' })
  siteCd: string;

  @MaxLengthI18n(30, { name: '現場名1' })
  @IsStringI18n({ name: '現場名1' })
  @IsNotEmptyI18n({ name: '現場名1' })
  siteNm1: string;

  @MaxLengthI18n(30, { name: '現場名2' })
  @IsStringI18n({ name: '現場名2' })
  @IsOptional()
  siteNm2?: string;

  @MaxLengthI18n(20, { name: '現場略称' })
  @IsStringI18n({ name: '現場略称' })
  @IsOptional()
  siteNmAb?: string;

  @MaxLengthI18n(30, { name: '現場カナ' })
  @IsStringI18n({ name: '現場カナ' })
  @IsOptional()
  siteKn?: string;

  @MaxLengthI18n(15, { name: '現場電話番号' })
  @IsStringI18n({ name: '現場電話番号' })
  @IsOptional()
  siteTelNumber?: string;

  @MaxLengthI18n(2, { name: '現場都道府県コード' })
  @IsStringI18n({ name: '現場都道府県コード' })
  @IsOptional()
  sitePrefCd?: string;

  @MaxLengthI18n(7, { name: '現場郵便番号' })
  @IsStringI18n({ name: '現場郵便番号' })
  @IsOptional()
  sitePostCd?: string;

  @MaxLengthI18n(30, { name: '現場住所1' })
  @IsStringI18n({ name: '現場住所1' })
  @IsNotEmptyI18n({ name: '現場住所1' })
  siteAddress1: string;

  @MaxLengthI18n(30, { name: '現場住所2' })
  @IsStringI18n({ name: '現場住所2' })
  @IsOptional()
  siteAddress2?: string;

  @IsDeleteFlg()
  deleteFlg: number;

  toMBase(): MBaseIf {
    return {
      baseCd: this.siteCd,
      baseDiv: BaseDiv.SITE,
      baseNm1: this.siteNm1,
      baseNm2: this.siteNm2,
      baseNmAb: this.siteNmAb,
      baseNmKn: this.siteKn,
      telNumber: this.siteTelNumber,
      prefCd: this.sitePrefCd,
      postCd: this.sitePostCd,
      address1: this.siteAddress1,
      address2: this.siteAddress2,
      deleteFlg: !!this.deleteFlg,
    };
  }
}
