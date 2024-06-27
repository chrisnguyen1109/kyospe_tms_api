import { BaseDiv } from '@app/common/types/div.type';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateMBaseIf, MBaseIf } from '../if.type';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';

export class CreateCustomerIfDto implements CreateMBaseIf {
  @MaxLengthI18n(7, { name: '得意先コード' })
  @IsStringI18n({ name: '得意先コード' })
  @IsNotEmptyI18n({ name: '得意先コード' })
  customerCd: string;

  @MaxLengthI18n(4, { name: '枝番' })
  @IsStringI18n({ name: '枝番' })
  @IsNotEmptyI18n({ name: '枝番' })
  branchNumber: string;

  @MaxLengthI18n(30, { name: '納品先名1' })
  @IsStringI18n({ name: '納品先名1' })
  @IsNotEmptyI18n({ name: '納品先名1' })
  deliveryDestinationNm1: string;

  @MaxLengthI18n(30, { name: '納品先名2' })
  @IsStringI18n({ name: '納品先名2' })
  @IsOptional()
  deliveryDestinationNm2?: string;

  @MaxLengthI18n(20, { name: '得意先略称' })
  @IsStringI18n({ name: '得意先略称' })
  @IsOptional()
  customerNmAb?: string;

  @MaxLengthI18n(30, { name: '得意先カナ' })
  @IsStringI18n({ name: '得意先カナ' })
  @IsOptional()
  customerKn?: string;

  @MaxLengthI18n(15, { name: '得意先電話番号' })
  @IsStringI18n({ name: '得意先電話番号' })
  @IsOptional()
  customerTelNumber?: string;

  @MaxLengthI18n(2, { name: '得意先都道府県コード' })
  @IsStringI18n({ name: '得意先都道府県コード' })
  @IsOptional()
  customerPrefCd?: string;

  @MaxLengthI18n(7, { name: '得意先郵便番号' })
  @IsStringI18n({ name: '得意先郵便番号' })
  @IsOptional()
  customerPostCd?: string;

  @MaxLengthI18n(30, { name: '得意先住所1' })
  @IsStringI18n({ name: '得意先住所1' })
  @IsNotEmptyI18n({ name: '得意先住所1' })
  customerAddress1: string;

  @MaxLengthI18n(30, { name: '得意先住所2' })
  @IsStringI18n({ name: '得意先住所2' })
  @IsOptional()
  customerAddress2?: string;

  @MaxLengthI18n(30, { name: '得意先住所3' })
  @IsStringI18n({ name: '得意先住所3' })
  @IsOptional()
  customerAddress3?: string;

  @IsDeleteFlg()
  deleteFlg: number;

  toMBase(): MBaseIf {
    return {
      baseCd: this.customerCd,
      baseEda: this.branchNumber,
      baseDiv:
        this.branchNumber === '0000'
          ? BaseDiv.CUSTOMER
          : BaseDiv.DELIVERY_DESTINATION,
      baseNm1: this.deliveryDestinationNm1,
      baseNm2: this.deliveryDestinationNm2,
      baseNmAb: this.customerNmAb,
      baseNmKn: this.customerKn,
      telNumber: this.customerTelNumber,
      prefCd: this.customerPrefCd,
      postCd: this.customerPostCd,
      address1: this.customerAddress1,
      address2: this.customerAddress2,
      address3: this.customerAddress3,
      deleteFlg: !!this.deleteFlg,
    };
  }
}
