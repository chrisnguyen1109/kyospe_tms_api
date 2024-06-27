import {
  CarSizeDiv,
  CarTypeDiv,
  DeliveryDiv,
  DeliveryStatusDiv,
  DispatchStatusDiv,
  PaymentMethodDiv,
  RoleDiv,
  SlipStatusDiv,
  StatusDiv,
  WorkKindsDiv,
} from '../types/div.type';

export const getRoleDivNm = (roleDiv: RoleDiv) => {
  const roleDivObj = {
    [RoleDiv.SYSTEM_ADMIN]: 'システム管理者',
    [RoleDiv.KYOTO_SPACER]: '京都スペーサー権限',
    [RoleDiv.TRANSPORT_COMPANY]: '運送会社権限',
    [RoleDiv.CARRIAGE_COMPANY]: '傭車権限',
  };

  return roleDivObj[roleDiv];
};

export const getCarTypeDivNm = (carType: CarTypeDiv) => {
  const carTypeDivObj = {
    [CarTypeDiv.TRUCK]: 'トラック',
    [CarTypeDiv.TRAILER]: 'トレーラー',
  };

  return carTypeDivObj[carType];
};

export const getCarSizeDivNm = (carSize: CarSizeDiv) => {
  const carSizeDivObj = {
    [CarSizeDiv['1.4T']]: '1.4ｔ平',
    [CarSizeDiv['1.5T']]: '1.5ｔ平',
    [CarSizeDiv['2T']]: '2ｔ平',
    [CarSizeDiv['2TW']]: '2ｔ平ワイド',
    [CarSizeDiv['2TL']]: '2ｔ平ロング',
    [CarSizeDiv['2TB']]: '2ｔ箱',
    [CarSizeDiv['3T']]: '3ｔ平',
    [CarSizeDiv['3TW']]: '3ｔ平ワイド',
    [CarSizeDiv['3TB']]: '3ｔ箱',
    [CarSizeDiv['3.5TU']]: '3.5ｔＵ',
    [CarSizeDiv['4TU']]: '4ｔＵ',
    [CarSizeDiv['4TW']]: '4ｔW',
    [CarSizeDiv['5TU']]: '5ｔＵ',
  };

  return carSizeDivObj[carSize];
};

export const getDispatchStatusDivNm = (
  dispatchStatusDiv: DispatchStatusDiv,
) => {
  const dispatchStatusDivObj = {
    [DispatchStatusDiv.UNCONFIRMED]: '未確定',
    [DispatchStatusDiv.CONFIRMED]: '確定済',
  };

  return dispatchStatusDivObj[dispatchStatusDiv];
};

export const getDeliveryDivNm = (deliveryDiv: DeliveryDiv) => {
  const deliveryDivObj = {
    [DeliveryDiv.ON_SITE_DELIVERY]: '現場配送',
    [DeliveryDiv.COLLECTION]: '引取',
    [DeliveryDiv.INVENTORY_MOVEMENT]: '在庫移動',
  };

  return deliveryDivObj[deliveryDiv];
};

export const getDeliveryStatusDivNm = (
  deliveryStatusDiv: DeliveryStatusDiv,
) => {
  const deliveryStatusDivObj = {
    [DeliveryStatusDiv.UNFINISHED]: '未完了',
    [DeliveryStatusDiv.RUNNING]: '運行中',
    [DeliveryStatusDiv.FINISHED]: '完了',
  };

  return deliveryStatusDivObj[deliveryStatusDiv];
};

export const getSlipStatusDivNm = (slipStatusDiv: SlipStatusDiv) => {
  const slipStatusDivObj = {
    [SlipStatusDiv.UNFINISHED]: '未完了',
    [SlipStatusDiv.FINISHED]: '完了',
    [SlipStatusDiv.TAKE_AWAY]: '持ち戻り',
    [SlipStatusDiv.DELETED]: '伝票削除',
  };

  return slipStatusDivObj[slipStatusDiv];
};

export const getPaymentMethodDivNm = (paymentMethodDiv: PaymentMethodDiv) => {
  const paymentMethodDivObj = {
    [PaymentMethodDiv.COMPANY_PAYMENT_CASH]: '会社払い（現金）',
    [PaymentMethodDiv.COMPANY_PAYMENT_ETC]: '会社払い（ETC）',
    [PaymentMethodDiv.PAYMENT_BY_INVOICE_CASH]: '請求払い（現金）',
    [PaymentMethodDiv.BILL_PAYMENT_ETC]: '請求払い（ETC）',
    [PaymentMethodDiv.SELF_PAYMENT_CASH]: '自費払い（現金）',
    [PaymentMethodDiv.SELF_PAYMENT_ETC]: '自費払い（ETC）',
  };

  return paymentMethodDivObj[paymentMethodDiv];
};

export const getWorkKindDivNm = (workKindsDiv: WorkKindsDiv) => {
  const workKindsDivObj = {
    [WorkKindsDiv.COLLECTION]: '引取',
    [WorkKindsDiv.UNLOADING]: '荷卸し',
  };

  return workKindsDivObj[workKindsDiv];
};

export const getStatusDivNm = (statusDiv: StatusDiv) => {
  const statusDivObj = {
    [StatusDiv.UNFINISHED]: '未完了',
    [StatusDiv.FINISHED]: '完了',
    [StatusDiv.BRING_BACK]: '持ち戻り',
  };

  return statusDivObj[statusDiv];
};
