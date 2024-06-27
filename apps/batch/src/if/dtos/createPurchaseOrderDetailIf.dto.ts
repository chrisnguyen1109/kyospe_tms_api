import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsNumberI18n } from '@app/common/validators/isNumberI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { MaxNumberLengthI18n } from '@app/common/validators/maxNumberLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateSlipDetailIf, SlipDetailIf } from '../if.type';
import { IsDynamicDecimalI18n } from '@app/common/validators/isDynamicDecimalI18n.validator';

export class CreatePurchaseOrderDetailIfDto implements CreateSlipDetailIf {
  @MaxLengthI18n(11, { name: '発注伝票No' })
  @IsStringI18n({ name: '発注伝票No' })
  @IsNotEmptyI18n({ name: '発注伝票No' })
  purchaseOrderSlipNo: string;

  @MaxNumberLengthI18n(4, { name: 'SeqNo' })
  @IsNumberI18n({}, { name: 'SeqNo' })
  @IsNotEmptyI18n({ name: 'SeqNo' })
  seqNo: number;

  @MaxNumberLengthI18n(3, { name: '発注行No' })
  @IsNumberI18n({}, { name: '発注行No' })
  @IsNotEmptyI18n({ name: '発注行No' })
  purchaseOrderGyoNo: number;

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

  @IsDynamicDecimalI18n('10', '2', { name: '発注ケース数量' })
  @IsOptional()
  numberOfCase?: string;

  @MaxLengthI18n(4, { name: '発注ケース単位' })
  @IsStringI18n({ name: '発注ケース単位' })
  @IsOptional()
  unitPerCase?: string;

  @IsDynamicDecimalI18n('10', '2', { name: '発注バラ数量' })
  @IsNotEmptyI18n({ name: '発注バラ数量' })
  numberOfItem: string;

  @MaxLengthI18n(4, { name: '発注バラ単位' })
  @IsStringI18n({ name: '発注バラ単位' })
  @IsOptional()
  unitPerItem?: string;

  @IsDynamicDecimalI18n('10', '2', { name: '総バラ数量' })
  @IsNotEmptyI18n({ name: '総バラ数量' })
  totalNumber: string;

  @MaxLengthI18n(50, { name: '備考テキスト' })
  @IsStringI18n({ name: '備考テキスト' })
  @IsOptional()
  remarks?: string;

  @MaxLengthI18n(11, { name: '受注伝票No' })
  @IsStringI18n({ name: '受注伝票No' })
  @IsOptional()
  orderSlipNo?: string;

  @MaxNumberLengthI18n(4, { name: '受注SeqNo' })
  @IsNumberI18n({}, { name: '受注SeqNo' })
  @IsOptional()
  orderSeqNo?: number;

  @MaxNumberLengthI18n(3, { name: '受注行No' })
  @IsNumberI18n({}, { name: '受注行No' })
  @IsOptional()
  orderGyoNo?: number;

  @IsDeleteFlg()
  deleteFlg: number;

  get slipNo() {
    return this.purchaseOrderSlipNo;
  }

  get gyoNo() {
    return this.purchaseOrderGyoNo;
  }

  toSlipDetail(): SlipDetailIf {
    return {
      slipNo: this.purchaseOrderSlipNo,
      gyoNo: this.purchaseOrderGyoNo,
      productNm: this.productNm,
      size: this.size,
      quantityPerCase: this.quantityPerCase,
      numberOfCases: this.numberOfCase,
      unitPerCase: this.unitPerCase,
      numberOfItems: this.numberOfItem,
      unitPerItem: this.unitPerItem,
      totalNumber: this.totalNumber,
      slipNoForPurchaseOrder: this.orderSlipNo,
      seqNoForPurchaseOrder: this.orderSeqNo,
      gyoNoForPurchaseOrder: this.orderGyoNo,
      remarks: this.remarks,
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
          slipNoForPurchaseOrder: this.slipNoForPurchaseOrder,
          seqNoForPurchaseOrder: this.seqNoForPurchaseOrder,
          gyoNoForPurchaseOrder: this.gyoNoForPurchaseOrder,
          remarks: this.remarks,
        };
      },
    };
  }
}
