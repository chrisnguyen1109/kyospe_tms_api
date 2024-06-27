import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import { CarrierCompany } from '@app/common/utils/carrierCompany.util';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsInI18n } from '@app/common/validators/isInI18n.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsNumberI18n } from '@app/common/validators/isNumberI18n.validator';
import { IsNumberStringI18n } from '@app/common/validators/isNumberStringI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { IsYYYYMMDDI18n } from '@app/common/validators/isYYYYMMDDI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { MaxNumberLengthI18n } from '@app/common/validators/maxNumberLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateSlipHeaderIf, SlipHeaderIf } from '../if.type';

export class CreateTransferHeaderIfDto implements CreateSlipHeaderIf {
  @MaxLengthI18n(11, { name: '在庫移動No' })
  @IsStringI18n({ name: '在庫移動No' })
  @IsNotEmptyI18n({ name: '在庫移動No' })
  transferNo: string;

  @MaxNumberLengthI18n(4, { name: 'SeqNo' })
  @IsNumberI18n({}, { name: 'SeqNo' })
  @IsNotEmptyI18n({ name: 'SeqNo' })
  seqNo: number;

  @MaxLengthI18n(7, { name: '移動担当者コード' })
  @IsNumberStringI18n({ name: '移動担当者コード' })
  @IsNotEmptyI18n({ name: '移動担当者コード' })
  transferStaffCd: string;

  @MaxLengthI18n(20, { name: '移動担当者名称' })
  @IsStringI18n({ name: '移動担当者名称' })
  @IsNotEmptyI18n({ name: '移動担当者名称' })
  transferStaffNm: string;

  @MaxLengthI18n(7, { name: '移動元倉庫コード' })
  @IsNumberStringI18n({ name: '移動元倉庫コード' })
  @IsNotEmptyI18n({ name: '移動元倉庫コード' })
  sourceWarehouseCd: string;

  @MaxLengthI18n(7, { name: '移動先倉庫コード' })
  @IsNumberStringI18n({ name: '移動先倉庫コード' })
  @IsNotEmptyI18n({ name: '移動先倉庫コード' })
  destinationWarehouseCd: string;

  @IsYYYYMMDDI18n('YYYY/MM/DD', { name: '移動出荷日付' })
  @IsNotEmptyI18n({ name: '移動出荷日付' })
  shippingDate: string;

  @IsYYYYMMDDI18n('YYYY/MM/DD', { name: '移動入荷日付' })
  @IsNotEmptyI18n({ name: '移動入荷日付' })
  receivingDate: string;

  @MaxLengthI18n(50, { name: '備考テキスト' })
  @IsStringI18n({ name: '備考テキスト' })
  @IsOptional()
  remarks?: string;

  @IsInI18n(CarrierCompany, { name: '運送会社' })
  @IsOptional()
  carrierCompany?: string;

  @MaxLengthI18n(15, { name: '配達希望時間' })
  @IsStringI18n({ name: '配達希望時間' })
  @IsOptional()
  requestDate?: string;

  @MaxLengthI18n(30, { name: '配送メモ' })
  @IsStringI18n({ name: '配送メモ' })
  @IsOptional()
  deliveryMemo?: string;

  @IsDeleteFlg()
  deleteFlg: number;

  get slipNo() {
    return this.transferNo;
  }

  toSlipHeader(): SlipHeaderIf {
    return {
      slipNo: this.transferNo,
      seqNo: this.seqNo,
      slipStatusDiv: SlipStatusDiv.UNFINISHED,
      deliveryDiv: DeliveryDiv.INVENTORY_MOVEMENT,
      transferStaffNm: this.transferStaffCd,
      shippingDate: this.shippingDate,
      receivingDate: this.receivingDate,
      sourceWarehouseCd: this.sourceWarehouseCd,
      destinationWarehouseCd: this.destinationWarehouseCd,
      carrierCompany: this.carrierCompany,
      remarks: this.remarks,
      deleteFlg: !!this.deleteFlg,
      requestDate: this.requestDate,
      deliveryMemo: this.deliveryMemo,

      toUpdate() {
        return {
          transferStaffNm: this.transferStaffNm,
          shippingDate: this.shippingDate,
          receivingDate: this.receivingDate,
          sourceWarehouseCd: this.sourceWarehouseCd,
          destinationWarehouseCd: this.destinationWarehouseCd,
          remarks: this.remarks,
          deleteFlg: !!this.deleteFlg,
          requestDate: this.requestDate,
          deliveryMemo: this.deliveryMemo,
        };
      },
    };
  }
}
