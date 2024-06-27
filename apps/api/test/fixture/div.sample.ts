import {
  DivCd,
  CarSizeDiv,
  CarTypeDiv,
  RoleDiv,
} from '@app/common/types/div.type';

export const div = [
  {
    divCd: DivCd.ROLE_DIV,
    divNm: '権限区分',
  },
  {
    divCd: DivCd.DISPATCH_STATUS_DIV,
    divNm: '配車状況区分',
  },
  {
    divCd: DivCd.CARSIZE_DIV,
    divNm: '車格区分',
  },
  {
    divCd: DivCd.CARTYPE_DIV,
    divNm: '車両タイプ区分',
  },
];

export const divValue = [
  {
    divCd: DivCd.ROLE_DIV,
    divValue: RoleDiv.SYSTEM_ADMIN,
    divValueNm: 'システム管理者',
  },
  {
    divCd: DivCd.ROLE_DIV,
    divValue: RoleDiv.KYOTO_SPACER,
    divValueNm: '京都スペーサー権限',
  },
  {
    divCd: DivCd.ROLE_DIV,
    divValue: RoleDiv.TRANSPORT_COMPANY,
    divValueNm: '運送会社権限',
  },
  {
    divCd: DivCd.ROLE_DIV,
    divValue: RoleDiv.CARRIAGE_COMPANY,
    divValueNm: '傭車権限',
  },
  {
    divCd: DivCd.CARSIZE_DIV,
    divValue: CarSizeDiv['1.5T'],
    divValueNm: '4t',
  },
  {
    divCd: DivCd.CARSIZE_DIV,
    divValue: CarSizeDiv['1.4T'],
    divValueNm: '6t',
  },
  {
    divCd: DivCd.CARTYPE_DIV,
    divValue: CarTypeDiv.TRUCK,
    divValueNm: 'トラック',
  },
  {
    divCd: DivCd.CARTYPE_DIV,
    divValue: CarTypeDiv.TRAILER,
    divValueNm: 'トレーラー',
  },
];
