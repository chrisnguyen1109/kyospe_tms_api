import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import { CarrierCompany } from '@app/common/utils/carrierCompany.util';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsDeliveryDivIf } from '@app/common/validators/isDeliveryDivIf.validator';
import { IsInI18n } from '@app/common/validators/isInI18n.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsNumberI18n } from '@app/common/validators/isNumberI18n.validator';
import { IsNumberStringI18n } from '@app/common/validators/isNumberStringI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { MaxNumberLengthI18n } from '@app/common/validators/maxNumberLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateSlipHeaderIf, SlipHeaderIf } from '../if.type';

export class CreatePurchaseOrderHeaderIfDto implements CreateSlipHeaderIf {
  @MaxLengthI18n(11, { name: '発注伝票No' })
  @IsStringI18n({ name: '発注伝票No' })
  @IsNotEmptyI18n({ name: '発注伝票No' })
  purchaseOrderSlipNo: string;

  @MaxNumberLengthI18n(4, { name: 'SeqNo' })
  @IsNumberI18n({}, { name: 'SeqNo' })
  @IsNotEmptyI18n({ name: 'SeqNo' })
  seqNo: number;

  @MaxLengthI18n(7, { name: '仕入先コード' })
  @IsNumberStringI18n({ name: '仕入先コード' })
  @IsNotEmptyI18n({ name: '仕入先コード' })
  supplierCd: string;

  @MaxLengthI18n(7, { name: '発注営業所コード' })
  @IsNumberStringI18n({ name: '発注営業所コード' })
  @IsNotEmptyI18n({ name: '発注営業所コード' })
  officeCd: string;

  @MaxLengthI18n(15, { name: '発注営業所名称' })
  @IsStringI18n({ name: '発注営業所名称' })
  @IsNotEmptyI18n({ name: '発注営業所名称' })
  officeNm: string;

  @MaxLengthI18n(7, { name: '発注担当者コード' })
  @IsNumberStringI18n({ name: '発注担当者コード' })
  @IsNotEmptyI18n({ name: '発注担当者コード' })
  staffCd: string;

  @MaxLengthI18n(20, { name: '発注担当者名称' })
  @IsStringI18n({ name: '発注担当者名称' })
  @IsNotEmptyI18n({ name: '発注担当者名称' })
  staffNm: string;

  @MaxLengthI18n(7, { name: '入荷倉庫コード' })
  @IsNumberStringI18n({ name: '入荷倉庫コード' })
  @IsNotEmptyI18n({ name: '入荷倉庫コード' })
  receivingWarehouseCd: string;

  @IsDeliveryDivIf()
  @IsNotEmptyI18n({ name: '配送区分' })
  deliveryDiv: DeliveryDiv;

  @MaxLengthI18n(50, { name: '引取情報' })
  @IsStringI18n({ name: '引取情報' })
  @IsOptional()
  pickupInformation?: string;

  @MaxLengthI18n(15, { name: '仕入担当者' })
  @IsStringI18n({ name: '仕入担当者' })
  @IsOptional()
  procurementOfficerNm?: string;

  @MaxLengthI18n(11, { name: '受注伝票No' })
  @IsStringI18n({ name: '受注伝票No' })
  @IsOptional()
  orderSlipNo?: string;

  @MaxNumberLengthI18n(4, { name: '受注SeqNo' })
  @IsNumberI18n({}, { name: '受注SeqNo' })
  @IsOptional()
  orderSeqNo?: number;

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
    return this.purchaseOrderSlipNo;
  }

  toSlipHeader(): SlipHeaderIf {
    return {
      slipNo: this.purchaseOrderSlipNo,
      seqNo: this.seqNo,
      slipStatusDiv: SlipStatusDiv.UNFINISHED,
      deliveryDiv: this.deliveryDiv,
      supplierCd: this.supplierCd,
      procurementOfficerNm: this.procurementOfficerNm,
      salesOffice: this.officeNm,
      salesRepresentativeNm: this.staffNm,
      receivingWarehouseCd: this.receivingWarehouseCd,
      slipNoForPurchaseOrder: this.orderSlipNo,
      seqNoForPurchaseOrder: this.orderSeqNo,
      pickupInformation: this.pickupInformation,
      carrierCompany: this.carrierCompany,
      remarks: this.remarks,
      deleteFlg: !!this.deleteFlg,
      requestDate: this.requestDate,
      deliveryMemo: this.deliveryMemo,

      checkImport() {
        return this.deliveryDiv === DeliveryDiv.COLLECTION;
      },

      toUpdate() {
        return {
          supplierCd: this.supplierCd,
          procurementOfficerNm: this.procurementOfficerNm,
          salesOffice: this.salesOffice,
          salesRepresentativeNm: this.salesRepresentativeNm,
          receivingWarehouseCd: this.receivingWarehouseCd,
          slipNoForPurchaseOrder: this.slipNoForPurchaseOrder,
          seqNoForPurchaseOrder: this.seqNoForPurchaseOrder,
          pickupInformation: this.pickupInformation,
          remarks: this.remarks,
          deleteFlg: !!this.deleteFlg,
          requestDate: this.requestDate,
          deliveryMemo: this.deliveryMemo,
        };
      },
    };
  }
}
