import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import { CarrierCompany } from '@app/common/utils/carrierCompany.util';
import { IsDeleteFlg } from '@app/common/validators/isDeleteFlg.validator';
import { IsDeliveryDivIf } from '@app/common/validators/isDeliveryDivIf.validator';
import { IsInI18n } from '@app/common/validators/isInI18n.validator';
import { IsNotEmptyI18n } from '@app/common/validators/isNotEmptyI18n.validator';
import { IsNumberI18n } from '@app/common/validators/isNumberI18n.validator';
import { IsStringI18n } from '@app/common/validators/isStringI18n.validator';
import { IsYYYYMMDDI18n } from '@app/common/validators/isYYYYMMDDI18n.validator';
import { MaxLengthI18n } from '@app/common/validators/maxLengthI18n.validator';
import { MaxNumberLengthI18n } from '@app/common/validators/maxNumberLengthI18n.validator';
import { IsOptional } from 'class-validator';
import { CreateSlipHeaderIf, SlipHeaderIf } from '../if.type';

export class CreateOrderHeaderIf implements CreateSlipHeaderIf {
  @MaxLengthI18n(11, { name: '受注伝票No' })
  @IsStringI18n({ name: '受注伝票No' })
  @IsNotEmptyI18n({ name: '受注伝票No' })
  orderSlipNo: string;

  @MaxNumberLengthI18n(4, { name: 'SeqNo' })
  @IsNumberI18n({}, { name: 'SeqNo' })
  @IsNotEmptyI18n({ name: 'SeqNo' })
  seqNo: number;

  @MaxLengthI18n(7, { name: '営業所コード' })
  @IsStringI18n({ name: '営業所コード' })
  @IsNotEmptyI18n({ name: '営業所コード' })
  officeCd: string;

  @MaxLengthI18n(15, { name: '営業所名称' })
  @IsStringI18n({ name: '営業所名称' })
  @IsNotEmptyI18n({ name: '営業所名称' })
  officeNm: string;

  @MaxLengthI18n(7, { name: '営業担当者コード' })
  @IsStringI18n({ name: '営業担当者コード' })
  @IsNotEmptyI18n({ name: '営業担当者コード' })
  salesStaffCd: string;

  @MaxLengthI18n(20, { name: '営業担当者名称' })
  @IsStringI18n({ name: '営業担当者名称' })
  @IsNotEmptyI18n({ name: '営業担当者名称' })
  salesStaffNm: string;

  @MaxLengthI18n(7, { name: '入力担当者コード' })
  @IsStringI18n({ name: '入力担当者コード' })
  @IsNotEmptyI18n({ name: '入力担当者コード' })
  inputStaffCd: string;

  @MaxLengthI18n(20, { name: '入力担当者名称' })
  @IsStringI18n({ name: '入力担当者名称' })
  @IsNotEmptyI18n({ name: '入力担当者名称' })
  inputStaffNm: string;

  @MaxLengthI18n(7, { name: '出荷倉庫コード' })
  @IsStringI18n({ name: '出荷倉庫コード' })
  @IsNotEmptyI18n({ name: '出荷倉庫コード' })
  shippingWarehouseCd: string;

  @IsYYYYMMDDI18n('YYYY/MM/DD', { name: '納期日' })
  @IsNotEmptyI18n({ name: '納期日' })
  shippingDeadlineDate: string;

  @IsYYYYMMDDI18n('YYYY/MM/DD', { name: '出荷予定日' })
  @IsNotEmptyI18n({ name: '出荷予定日' })
  shippingDate: string;

  @MaxLengthI18n(7, { name: '得意先コード' })
  @IsStringI18n({ name: '得意先コード' })
  @IsNotEmptyI18n({ name: '得意先コード' })
  customerAddressCd: string;

  @MaxLengthI18n(4, { name: '得意先枝番' })
  @IsStringI18n({ name: '得意先枝番' })
  @IsNotEmptyI18n({ name: '得意先枝番' })
  customerAddressBranch: string;

  @MaxLengthI18n(20, { name: '現場コード' })
  @IsStringI18n({ name: '現場コード' })
  @IsOptional()
  siteCd?: string;

  @MaxLengthI18n(7, { name: '納品先コード' })
  @IsStringI18n({ name: '納品先コード' })
  @IsOptional()
  deliveryDestinationCd?: string;

  @MaxLengthI18n(4, { name: '納品先枝番' })
  @IsStringI18n({ name: '納品先枝番' })
  @IsOptional()
  deliveryDestinationBranch?: string;

  @MaxLengthI18n(50, { name: '備考テキスト' })
  @IsStringI18n({ name: '備考テキスト' })
  @IsOptional()
  remarks?: string;

  @IsDeliveryDivIf()
  @IsNotEmptyI18n({ name: '配送区分' })
  deliveryDiv: DeliveryDiv;

  @IsInI18n(CarrierCompany, { name: '配送業者' })
  @IsOptional()
  carrierCompany?: string;

  @MaxLengthI18n(7, { name: '工場倉庫コード' })
  @IsStringI18n({ name: '工場倉庫コード' })
  @IsOptional()
  factoryWarehouseCd?: string;

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
    return this.orderSlipNo;
  }

  toSlipHeader(): SlipHeaderIf {
    return {
      slipNo: this.orderSlipNo,
      seqNo: this.seqNo,
      slipStatusDiv: SlipStatusDiv.UNFINISHED,
      deliveryDiv: this.deliveryDiv,
      salesOffice: this.officeNm,
      salesRepresentativeNm: this.salesStaffNm,
      inputStaffNm: this.inputStaffNm,
      shippingDate: this.shippingDate,
      receivingDate: this.shippingDeadlineDate,
      shippingWarehouseCd: this.shippingWarehouseCd,
      customerCd: this.customerAddressCd,
      customerBranchNumber: this.customerAddressBranch,
      siteCd: this.siteCd,
      deliveryDestinationCd: this.deliveryDestinationCd,
      deliveryDestinationBranchNum: this.deliveryDestinationBranch,
      factoryWarehouseCd: this.factoryWarehouseCd,
      carrierCompany: this.carrierCompany,
      remarks: this.remarks,
      deleteFlg: !!this.deleteFlg,
      requestDate: this.requestDate,
      deliveryMemo: this.deliveryMemo,

      checkImport() {
        return this.deliveryDiv === DeliveryDiv.ON_SITE_DELIVERY;
      },

      toUpdate() {
        return {
          salesOffice: this.salesOffice,
          salesRepresentativeNm: this.salesRepresentativeNm,
          inputStaffNm: this.inputStaffNm,
          shippingDate: this.shippingDate,
          receivingDate: this.receivingDate,
          shippingWarehouseCd: this.shippingWarehouseCd,
          customerCd: this.customerCd,
          customerBranchNumber: this.customerBranchNumber,
          siteCd: this.siteCd,
          deliveryDestinationCd: this.deliveryDestinationCd,
          deliveryDestinationBranchNum: this.deliveryDestinationBranchNum,
          factoryWarehouseCd: this.factoryWarehouseCd,
          remarks: this.remarks,
          deleteFlg: !!this.deleteFlg,
          requestDate: this.requestDate,
          deliveryMemo: this.deliveryMemo,
        };
      },
    };
  }
}
