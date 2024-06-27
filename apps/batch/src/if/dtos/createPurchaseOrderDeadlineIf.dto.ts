import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsDynamicDecimalI18n } from '@app/common/validators/isDynamicDecimalI18n.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsNumberI18n } from '@app/common/validators/isNumberI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { IsYYYYMMDDI18n } from '@app/common/validators/isYYYYMMDDI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { MaxNumberLengthI18n } from '@app/common/validators/maxNumberLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateSlipDeadlineIf, SlipDeadlineIf } from '../if.type';

export class CreatePurchaseOrderDeadlineIfDto implements CreateSlipDeadlineIf {
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

  @MaxNumberLengthI18n(3, { name: '納期行No' })
  @IsNumberI18n({}, { name: '納期行No' })
  @IsNotEmptyI18n({ name: '納期行No' })
  deadlineNo: number;

  @IsDynamicDecimalI18n('10', '2', { name: '発注ケース数量' })
  @IsOptional()
  numberOfCase?: string;

  @IsDynamicDecimalI18n('10', '2', { name: '発注バラ数量' })
  @IsNotEmptyI18n()
  numberOfItem: string;

  @IsDynamicDecimalI18n('10', '2', { name: '総バラ数量' })
  @IsNotEmptyI18n()
  totalNumber: string;

  @IsYYYYMMDDI18n('YYYY/MM/DD', { name: '回答納期日' })
  @IsOptional()
  answerDeadlineDate?: string;

  @IsDeleteFlg()
  deleteFlg: number;

  get slipNo() {
    return this.purchaseOrderSlipNo;
  }

  get gyoNo() {
    return this.purchaseOrderGyoNo;
  }

  toSlipDeadline(): SlipDeadlineIf {
    return {
      slipNo: this.purchaseOrderSlipNo,
      gyoNo: this.purchaseOrderGyoNo,
      deadlineNo: this.deadlineNo,
      numberOfCases: this.numberOfCase,
      numberOfItems: this.numberOfItem,
      totalNumber: this.totalNumber,
      deadline: this.answerDeadlineDate ?? '1000/01/01',
      deleteFlg: !!this.deleteFlg,

      toUpdate() {
        return {
          numberOfCases: this.numberOfCases,
          numberOfItems: this.numberOfItems,
          totalNumber: this.totalNumber,
          deadline: this.deadline,
        };
      },
    };
  }
}
