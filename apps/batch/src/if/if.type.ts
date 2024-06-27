import {
  BaseDiv,
  DeliveryDiv,
  SlipStatusDiv,
} from '@app/common/types/div.type';
import { MBaseEntity } from '@app/database/entities/mBase.entity';

export interface MBaseIf {
  baseCd: string;
  baseEda?: string;
  baseDiv: BaseDiv;
  baseNm1: string;
  baseNm2?: string;
  baseNmAb?: string;
  baseNmKn?: string;
  telNumber?: string;
  latitude?: string;
  longitude?: string;
  prefCd?: string;
  postCd?: string;
  address1: string;
  address2?: string;
  address3?: string;
  deleteFlg: boolean;
}

export interface CreateMBaseIf {
  toMBase(): MBaseIf;
}

export interface SlipHeaderIf {
  slipNo: string;
  seqNo: number;
  slipStatusDiv: SlipStatusDiv;
  deliveryDiv: DeliveryDiv;
  supplierCd?: string;
  procurementOfficerNm?: string;
  salesOffice?: string;
  salesRepresentativeNm?: string;
  inputStaffNm?: string;
  transferStaffNm?: string;
  shippingDate?: string;
  receivingDate?: string;
  receivingWarehouseCd?: string;
  shippingWarehouseCd?: string;
  sourceWarehouseCd?: string;
  destinationWarehouseCd?: string;
  customerCd?: string;
  customerBranchNumber?: string;
  siteCd?: string;
  deliveryDestinationCd?: string;
  deliveryDestinationBranchNum?: string;
  factoryWarehouseCd?: string;
  slipNoForPurchaseOrder?: string;
  seqNoForPurchaseOrder?: number;
  pickupInformation?: string;
  carrierCompany?: string;
  remarks?: string;
  deleteFlg: boolean;
  requestDate?: string;
  deliveryMemo?: string;

  checkImport?: () => boolean;
  toUpdate: () => {
    supplierCd?: string;
    procurementOfficerNm?: string;
    salesOffice?: string;
    salesRepresentativeNm?: string;
    receivingWarehouseCd?: string;
    slipNoForPurchaseOrder?: string;
    seqNoForPurchaseOrder?: number;
    pickupInformation?: string;
    remarks?: string;
    deleteFlg: boolean;
    requestDate?: string;
    deliveryMemo?: string;
    inputStaffNm?: string;
    shippingDate?: string;
    receivingDate?: string;
    shippingWarehouseCd?: string;
    customerCd?: string;
    customerBranchNumber?: string;
    siteCd?: string;
    deliveryDestinationCd?: string;
    deliveryDestinationBranchNum?: string;
    factoryWarehouseCd?: string;
    transferStaffNm?: string;
    sourceWarehouseCd?: string;
    destinationWarehouseCd?: string;
  };
}

export interface CreateSlipHeaderIf {
  slipNo: string;
  seqNo: number;
  shippingWarehouseCd?: string;
  customerAddressCd?: string;
  customerAddressBranch?: string;
  siteCd?: string;
  deliveryDestinationCd?: string;
  deliveryDestinationBranch?: string;
  factoryWarehouseCd?: string;
  supplierCd?: string;
  receivingWarehouseCd?: string;
  sourceWarehouseCd?: string;
  destinationWarehouseCd?: string;
  carrierCompany?: string;
  toSlipHeader(): SlipHeaderIf;
}

export interface SlipDetailIf {
  slipNo: string;
  gyoNo: number;
  productNm?: string;
  size?: string;
  quantityPerCase?: number;
  numberOfCases?: string;
  unitPerCase?: string;
  numberOfItems?: string;
  unitPerItem?: string;
  totalNumber?: string;
  slipNoForPurchaseOrder?: string;
  seqNoForPurchaseOrder?: number;
  gyoNoForPurchaseOrder?: number;
  remarks?: string;
  deleteFlg: boolean;

  toUpdate: () => {
    productNm?: string;
    size?: string;
    quantityPerCase?: number;
    numberOfCases?: string;
    unitPerCase?: string;
    numberOfItems?: string;
    unitPerItem?: string;
    totalNumber?: string;
    slipNoForPurchaseOrder?: string;
    seqNoForPurchaseOrder?: number;
    gyoNoForPurchaseOrder?: number;
    remarks?: string;
  };
}

export interface CreateSlipDetailIf {
  slipNo: string;
  seqNo: number;
  gyoNo: number;
  toSlipDetail(): SlipDetailIf;
}

export interface SlipDeadlineIf {
  slipNo: string;
  gyoNo: number;
  deadlineNo: number;
  numberOfCases?: string;
  numberOfItems?: string;
  totalNumber?: string;
  deadline?: string;
  deleteFlg: boolean;

  toUpdate: () => {
    numberOfCases?: string;
    numberOfItems?: string;
    totalNumber?: string;
    deadline?: string;
  };
}

export interface CreateSlipDeadlineIf {
  slipNo: string;
  seqNo: number;
  gyoNo: number;
  deadlineNo: number;
  toSlipDeadline(): SlipDeadlineIf;
}

export type SlipFilterObj = Record<
  string,
  { head?: string; detail?: string; deadline?: string }
>;

export enum IfMBaseType {
  WAREHOUSE = 'warehouse',
  SITE = 'site',
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
}

export enum IfSlipType {
  ORDER = 'order',
  PURCHASE_ORDER = 'purchaseOrder',
  TRANSFER = 'transfer',
}

export enum IfFileType {
  WAREHOUSE = 'tms_ｍ_warehouse',
  SITE = 'tms_ｍ_site',
  SUPPLIER = 'tms_ｍ_supplier',
  CUSTOMER = 'tms_ｍ_customer',

  ORDER_HEADER = 'head_tms_order',
  ORDER_DETAIL = 'detail_tms_order',

  PURCHASE_ORDER_HEADER = 'head_tms_purchaseOrder',
  PURCHASE_ORDER_DETAIL = 'detail_tms_purchaseOrder',
  PURCHASE_ORDER_DEADLINE = 'deadline_tms_purchaseOrder',

  TRANSFER_HEADER = 'head_tms_transfer',
  TRANSFER_DETAIL = 'detail_tms_transfer',
}

export interface IfCsvRecord<T = any> {
  record: T;
  metadata: {
    lines: number;
    fileName: string;
  };
}

export interface ValidateObject<Z = any> {
  resolve: (value: Z | PromiseLike<Z>) => void;
  addError: (error: string) => void;
  readonly isError: boolean;
}

export type IfKeyRecord = Record<
  string,
  {
    metadata: IfCsvRecord['metadata'];
    checked: boolean;
    skip: boolean;
  }
>;

export enum IfType {
  MASTER_BASE = 'master',
  SLIP = 'tms_order',
  SIGN = 'result',
}

export interface SignData {
  slipNo: string;
  deadline: string;
  workEndTime: string;
  slipStatusDiv: string;
  transportCompanyNm: string;
  driverNm?: string;
  electronicSignatureImage?: string;
}

export interface SlipRecordObject {
  [headerKey: string]: {
    record: SlipHeaderIf;
    metadata: IfCsvRecord['metadata'];
    detail: {
      [detailKey: string]: {
        record: SlipDetailIf;
        metadata: IfCsvRecord['metadata'];
        deadline: {
          [deadlineKey: string]: {
            record: SlipDeadlineIf;
          };
        };
      };
    };
  };
}

export interface TripRecordObject {
  [tripKey: string]: {
    ifSlipType: IfSlipType;
    slipNo: string;
    serviceYmd: string;
    startBase: MBaseEntity;
    arriveBase: MBaseEntity;
    deleteFlg: boolean;
  };
}
