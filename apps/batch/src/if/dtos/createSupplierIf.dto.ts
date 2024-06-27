import { BaseDiv } from '@app/common/types/div.type';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateMBaseIf, MBaseIf } from '../if.type';

export class CreateSupplierIfDto implements CreateMBaseIf {
  @MaxLengthI18n(7, { name: '仕入先コード' })
  @IsStringI18n({ name: '仕入先コード' })
  @IsNotEmptyI18n({ name: '仕入先コード' })
  supplierCd: string;

  @MaxLengthI18n(30, { name: '仕入先名1' })
  @IsStringI18n({ name: '仕入先名1' })
  @IsNotEmptyI18n({ name: '仕入先名1' })
  supplierNm1: string;

  @MaxLengthI18n(30, { name: '仕入先名2' })
  @IsStringI18n({ name: '仕入先名2' })
  @IsOptional()
  supplierNm2?: string;

  @MaxLengthI18n(20, { name: '仕入先略称' })
  @IsStringI18n({ name: '仕入先略称' })
  @IsOptional()
  supplierNmAb?: string;

  @MaxLengthI18n(30, { name: '仕入先カナ' })
  @IsStringI18n({ name: '仕入先カナ' })
  @IsOptional()
  supplierKn?: string;

  @MaxLengthI18n(15, { name: '仕入先電話番号' })
  @IsStringI18n({ name: '仕入先電話番号' })
  @IsOptional()
  supplierTelNumber?: string;

  @MaxLengthI18n(2, { name: '仕入先都道府県コード' })
  @IsStringI18n({ name: '仕入先都道府県コード' })
  @IsOptional()
  supplierPrefCd?: string;

  @MaxLengthI18n(7, { name: '仕入先郵便番号' })
  @IsStringI18n({ name: '仕入先郵便番号' })
  @IsOptional()
  supplierPostCd?: string;

  @MaxLengthI18n(30, { name: '仕入先住所1' })
  @IsStringI18n({ name: '仕入先住所1' })
  @IsNotEmptyI18n({ name: '仕入先住所1' })
  supplierAddress1: string;

  @MaxLengthI18n(30, { name: '仕入先住所2' })
  @IsStringI18n({ name: '仕入先住所2' })
  @IsOptional()
  supplierAddress2?: string;

  @MaxLengthI18n(30, { name: '仕入先住所3' })
  @IsStringI18n({ name: '仕入先住所3' })
  @IsOptional()
  supplierAddress3?: string;

  @IsDeleteFlg()
  deleteFlg: number;

  toMBase(): MBaseIf {
    return {
      baseCd: this.supplierCd,
      baseDiv: BaseDiv.SUPPLIER,
      baseNm1: this.supplierNm1,
      baseNm2: this.supplierNm2,
      baseNmAb: this.supplierNmAb,
      baseNmKn: this.supplierKn,
      telNumber: this.supplierTelNumber,
      prefCd: this.supplierPrefCd,
      postCd: this.supplierPostCd,
      address1: this.supplierAddress1,
      address2: this.supplierAddress2,
      address3: this.supplierAddress3,
      deleteFlg: !!this.deleteFlg,
    };
  }
}
