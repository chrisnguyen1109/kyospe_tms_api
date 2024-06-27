export enum DivCd {
  ROLE_DIV = '00000001',
  DISPATCH_STATUS_DIV = '00000002',
  DELIVERY_STATUS_DIV = '00000003',
  SLIP_STATUS_DIV = '00000004',
  PAYMENT_METHOD_DIV = '00000005',
  DELIVERY_DIV = '00000006',
  SPOT_DIV = '00000007',
  WORK_KINDS_DIV = '00000008',
  AREA_DIV = '00000009',
  STATUS_DIV = '00000010',
  BASE_DIV = '00000011',
  CARSIZE_DIV = '00000012',
  CARTYPE_DIV = '00000013',
  MAIL_DIV = '00000014',
}

export enum BaseDiv {
  WAREHOUSE = '01',
  SITE = '02',
  CUSTOMER = '03',
  DELIVERY_DESTINATION = '04',
  SUPPLIER = '05',
}

export enum RoleDiv {
  SYSTEM_ADMIN = '01',
  KYOTO_SPACER = '02',
  TRANSPORT_COMPANY = '03',
  CARRIAGE_COMPANY = '04',
}

export enum MailDiv {
  CREATE_ACCOUNT = '01',
  EDIT_ACCOUNT = '02',
  FORGOT_PASSWORD = '03',
  INIT_PASSWORD = '04',
}

export enum CarSizeDiv {
  '1.4T' = '01',
  '1.5T' = '02',
  '2T' = '03',
  '2TW' = '04',
  '2TL' = '05',
  '2TB' = '06',
  '3T' = '07',
  '3TW' = '08',
  '3TB' = '09',
  '3.5TU' = '10',
  '4TU' = '11',
  '4TW' = '12',
  '5TU' = '13',
}

export enum CarTypeDiv {
  TRUCK = '01',
  TRAILER = '02',
}

export enum AreaDiv {
  EAST = '01',
  WEST = '02',
}

export enum DispatchStatusDiv {
  UNCONFIRMED = '01',
  CONFIRMED = '02',
}

export enum DeliveryStatusDiv {
  UNFINISHED = '01',
  RUNNING = '02',
  FINISHED = '03',
}

export enum DeliveryDiv {
  ON_SITE_DELIVERY = '01',
  COLLECTION = '02',
  INVENTORY_MOVEMENT = '03',
}

export enum StatusDiv {
  UNFINISHED = '01',
  FINISHED = '02',
  BRING_BACK = '03',
}

export enum SpotDiv {
  SHIPPING_WAREHOUSE = '01',
  RECEIVING_WAREHOUSE = '02',
  DELIVERY_DESTINATION_SITE = '03',
  SUPPLIER = '11',
}

export enum WorkKindsDiv {
  COLLECTION = '01',
  UNLOADING = '02',
}

export enum PaymentMethodDiv {
  COMPANY_PAYMENT_CASH = '01',
  COMPANY_PAYMENT_ETC = '02',
  PAYMENT_BY_INVOICE_CASH = '03',
  BILL_PAYMENT_ETC = '04',
  SELF_PAYMENT_CASH = '05',
  SELF_PAYMENT_ETC = '06',
}

export enum SlipStatusDiv {
  UNFINISHED = '01',
  FINISHED = '02',
  TAKE_AWAY = '03',
  DELETED = '04',
}
