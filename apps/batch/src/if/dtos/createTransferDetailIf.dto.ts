import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsNumberI18n } from '@app/common/validators/isNumberI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { MaxNumberLengthI18n } from '@app/common/validators/maxNumberLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateSlipDetailIf, SlipDetailIf } from '../if.type';
import { IsDynamicDecimalI18n } from '@app/common/validators/isDynamicDecimalI18n.validator';

export class CreateTransferDetailIfDto implements CreateSlipDetailIf {
  @MaxLengthI18n(11, { name: '在庫移動No' })
  @IsStringI18n({ name: '在庫移動No' })
  @IsNotEmptyI18n({ name: '在庫移動No' })
  transferNo: string;

  @MaxNumberLengthI18n(4, { name: 'SeqNo' })
  @IsNumberI18n({}, { name: 'SeqNo' })
  @IsNotEmptyI18n({ name: 'SeqNo' })
  seqNo: number;

  @MaxNumberLengthI18n(3, { name: '在庫移動行No' })
  @IsNumberI18n({}, { name: '在庫移動行No' })
  @IsNotEmptyI18n({ name: '在庫移動行No' })
  transferGyoNo: number;

  @MaxLengthI18n(30, { name: '商品名称' })
  @IsStringI18n({ name: '商品名称' })
  @IsOptional()
  productNm?: string;

  @MaxLengthI18n(43, { name: 'サイズ' })
  @IsStringI18n({ name: 'サイズ' })
  @IsOptional()
  size?: string;

  @MaxNumberLengthI18n(6, { name: '入数' })
  @IsNumberI18n({}, { name: '入数' })
  @IsOptional()
  quantityPerCase?: number;

  @IsDynamicDecimalI18n('10', '2', { name: '移動ケース数量' })
  @IsOptional()
  numberOfCase?: string;

  @MaxLengthI18n(4, { name: '移動ケース単位' })
  @IsStringI18n({ name: '移動ケース単位' })
  @IsOptional()
  unitPerCase?: string;

  @IsDynamicDecimalI18n('10', '2', { name: '移動出荷バラ数量' })
  @IsNotEmptyI18n({ name: '移動出荷バラ数量' })
  numberOfItem: string;

  @MaxLengthI18n(4, { name: '出荷バラ単位' })
  @IsStringI18n({ name: '出荷バラ単位' })
  @IsOptional()
  unitPerItem?: string;

  @IsDynamicDecimalI18n('10', '2', { name: '移動総バラ数量' })
  @IsNotEmptyI18n({ name: '移動総バラ数量' })
  totalNumber: string;

  @IsDeleteFlg()
  deleteFlg: number;

  get slipNo() {
    return this.transferNo;
  }

  get gyoNo() {
    return this.transferGyoNo;
  }

  toSlipDetail(): SlipDetailIf {
    return {
      slipNo: this.transferNo,
      gyoNo: this.transferGyoNo,
      productNm: this.productNm,
      size: this.size,
      quantityPerCase: this.quantityPerCase,
      numberOfCases: this.numberOfCase,
      unitPerCase: this.unitPerCase,
      numberOfItems: this.numberOfItem,
      unitPerItem: this.unitPerItem,
      totalNumber: this.totalNumber,
      deleteFlg: !!this.deleteFlg,

      toUpdate() {
        return {
          productNm: this.productNm,
          size: this.size,
          quantityPerCase: this.quantityPerCase,
          numberOfCases: this.numberOfCases,
          unitPerCase: this.unitPerCase,
          numberOfItems: this.numberOfItems,
          unitPerItem: this.unitPerItem,
          totalNumber: this.totalNumber,
        };
      },
    };
  }
}
