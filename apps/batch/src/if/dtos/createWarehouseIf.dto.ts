import { BaseDiv } from '@app/common/types/div.type';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateMBaseIf, MBaseIf } from '../if.type';

export class CreateWarehouseIfDto implements CreateMBaseIf {
  @MaxLengthI18n(7, { name: '倉庫コード' })
  @IsStringI18n({ name: '倉庫コード' })
  @IsNotEmptyI18n({ name: '倉庫コード' })
  warehouseCd: string;

  @MaxLengthI18n(15, { name: '倉庫名' })
  @IsStringI18n({ name: '倉庫名' })
  @IsNotEmptyI18n({ name: '倉庫名' })
  warehouseNm: string;

  @MaxLengthI18n(10, { name: '倉庫略称' })
  @IsStringI18n({ name: '倉庫略称' })
  @IsOptional()
  warehouseNmAb?: string;

  @MaxLengthI18n(30, { name: '倉庫カナ' })
  @IsStringI18n({ name: '倉庫カナ' })
  @IsOptional()
  warehouseKn: string;

  @MaxLengthI18n(15, { name: '倉庫電話番号' })
  @IsStringI18n({ name: '倉庫電話番号' })
  @IsOptional()
  warehouseTelNumber?: string;

  @MaxLengthI18n(2, { name: '倉庫都道府県コード' })
  @IsStringI18n({ name: '倉庫都道府県コード' })
  @IsOptional()
  warehousePrefCd?: string;

  @MaxLengthI18n(7, { name: '倉庫郵便番号' })
  @IsStringI18n({ name: '倉庫郵便番号' })
  @IsOptional()
  warehousePostCd?: string;

  @MaxLengthI18n(30, { name: '倉庫住所１' })
  @IsStringI18n({ name: '倉庫住所１' })
  @IsNotEmptyI18n({ name: '倉庫住所１' })
  warehouseAddress1: string;

  @MaxLengthI18n(30, { name: '倉庫住所２' })
  @IsStringI18n({ name: '倉庫住所２' })
  @IsOptional()
  warehouseAddress2?: string;

  @MaxLengthI18n(30, { name: '倉庫住所３' })
  @IsStringI18n({ name: '倉庫住所３' })
  @IsOptional()
  warehouseAddress3?: string;

  @IsDeleteFlg()
  deleteFlg: number;

  toMBase(): MBaseIf {
    return {
      baseCd: this.warehouseCd,
      baseDiv: BaseDiv.WAREHOUSE,
      baseNm1: this.warehouseNm,
      baseNmAb: this.warehouseNmAb,
      baseNmKn: this.warehouseKn,
      telNumber: this.warehouseTelNumber,
      prefCd: this.warehousePrefCd,
      postCd: this.warehousePostCd,
      address1: this.warehouseAddress1,
      address2: this.warehouseAddress2,
      address3: this.warehouseAddress3,
      deleteFlg: !!this.deleteFlg,
    };
  }
}
