import {
  BaseDiv,
  CarSizeDiv,
  CarTypeDiv,
  RoleDiv,
} from '@app/common/types/div.type';

export const sample = {
  loginUser: {
    systemAdmin: {
      loginId: 'system-admin',
      password: '123456',
    },
    kyoSpacer: {
      loginId: 'kyo-spacer1',
      password: '123456',
    },
    transportCompany: {
      loginId: 'transport-employee1',
      password: '123456',
    },
    carriageCompany: {
      loginId: 'carriage-employee1',
      password: '123456',
    },
  },

  users: [
    {
      mUserId: 1,
      userId: 'system-admin',
      mailAddress: 'system-admin@gmail.com',
      userNm: 'system-admin',
      userNmKn: 'system-admin',
      roleDiv: RoleDiv.SYSTEM_ADMIN,
      password: '123456',
    },
    {
      mUserId: 2,
      userId: 'kyo-spacer1',
      mailAddress: 'kyo-spacer1@gmail.com',
      userNm: 'kyo-spacer1',
      userNmKn: 'kyo-spacer1',
      roleDiv: RoleDiv.KYOTO_SPACER,
      password: '123456',
    },
    {
      mUserId: 3,
      userId: 'transport-employee1',
      mailAddress: 'transport-employee1@gmail.com',
      userNm: 'transport-employee1',
      userNmKn: 'transport-employee1',
      roleDiv: RoleDiv.TRANSPORT_COMPANY,
      password: '123456',
      transportCompanyId: 1,
    },
    {
      mUserId: 4,
      userId: 'carriage-employee1',
      mailAddress: 'carriage-employee1@gmail.com',
      userNm: 'carriage-employee1',
      userNmKn: 'carriage-employee1',
      roleDiv: RoleDiv.CARRIAGE_COMPANY,
      password: '123456',
      transportCompanyId: 1,
      mainBaseId: 1,
    },
  ],

  bases: [
    {
      baseId: 1,
      baseCd: 'cd1',
      baseDiv: BaseDiv.WAREHOUSE,
      baseNm1: 'base name 1',
      baseNmKn: 'base kana name 1',
      postCd: '111',
      address1: 'address 1 - 1',
    },
    {
      baseId: 2,
      baseCd: 'cd2',
      baseDiv: BaseDiv.WAREHOUSE,
      baseNm1: 'base name 2',
      baseNmKn: 'base kana name 2',
      postCd: '112',
      address1: 'address 2 - 1',
    },
  ],

  transportCompanies: [
    {
      transportCompanyId: 1,
      transportCompanyNm: 'Mock transport company 1',
      telNumber: '012-3456-789',
      carriageBaseId: 1,
    },
    {
      transportCompanyId: 2,
      transportCompanyNm: 'Mock transport company 2',
      telNumber: '012-3456-789',
      carriageBaseId: 1,
    },
    {
      transportCompanyId: 3,
      transportCompanyNm: 'Mock transport company 3',
      telNumber: '012-3456-789',
      carriageBaseId: 1,
      parentCompanyId: 1,
    },
    {
      transportCompanyId: 4,
      transportCompanyNm: 'Mock transport company 4',
      telNumber: '012-3456-789',
      carriageBaseId: 1,
      parentCompanyId: 1,
    },
    {
      transportCompanyId: 5,
      transportCompanyNm: 'Mock transport company 5',
      telNumber: '012-3456-789',
      carriageBaseId: 1,
      parentCompanyId: 1,
    },
  ],

  drivers: [
    {
      driverId: 1,
      transportCompanyId: 1,
      driverNm: 'Mocker driver 1',
      driverNmKn: 'Mocker driver kana 1',
      telNumber: '012-3456-789',
    },
    {
      driverId: 2,
      transportCompanyId: 2,
      driverNm: 'Mocker driver 2',
      driverNmKn: 'Mocker driver kana 2',
      telNumber: '012-3456-789',
    },
    {
      driverId: 3,
      transportCompanyId: 3,
      driverNm: 'Mocker driver 3',
      driverNmKn: 'Mocker driver kana 3',
      telNumber: '012-3456-789',
    },
  ],

  cars: [
    {
      carId: 1,
      carManagementNum: 'Mock car 1',
      leaseStartYmd: '2023-06-15',
      leaseEndYmd: '2023-06-30',
      owningCompanyId: 1,
      carType: CarTypeDiv.TRAILER,
      carSize: CarSizeDiv['1.4T'],
    },
    {
      carId: 2,
      carManagementNum: 'Mock car 2',
      leaseStartYmd: '2023-06-16',
      leaseEndYmd: '2023-06-21',
      owningCompanyId: 1,
      carType: CarTypeDiv.TRUCK,
      carSize: CarSizeDiv['1.4T'],
    },
    {
      carId: 3,
      carManagementNum: 'Mock car 3',
      leaseStartYmd: '2023-06-16',
      leaseEndYmd: '2023-06-24',
      owningCompanyId: 1,
      carType: CarTypeDiv.TRUCK,
      carSize: CarSizeDiv['1.4T'],
    },
    {
      carId: 4,
      carManagementNum: 'Mock car 4',
      leaseStartYmd: '2023-06-17',
      leaseEndYmd: '2023-06-24',
      owningCompanyId: 2,
      carType: CarTypeDiv.TRAILER,
      carSize: CarSizeDiv['1.4T'],
    },
    {
      carId: 5,
      carManagementNum: 'Mock car 5',
      leaseStartYmd: '2023-06-07',
      leaseEndYmd: '2023-06-23',
      owningCompanyId: 2,
      carType: CarTypeDiv.TRAILER,
      carSize: CarSizeDiv['1.4T'],
    },
  ],
};
