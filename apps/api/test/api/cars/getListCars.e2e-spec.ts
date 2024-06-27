import { AppModule } from '@api/app.module';
import { OrderBy } from '@app/common/types/common.type';
import { CarSizeDiv, CarTypeDiv } from '@app/common/types/div.type';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { carriageCompanyGetAllCars } from '../../expect/cars/listCar/carriageCompanyGetAllCars';
import { systemAdminGetAllCars } from '../../expect/cars/listCar/systemAdminGetAllCars';
import { systemAdminSearchCarManagementNum } from '../../expect/cars/listCar/systemAdminSearchCarManagementNum';
import { systemAdminSearchCarSize } from '../../expect/cars/listCar/systemAdminSearchCarSize';
import { systemAdminSearchCarType } from '../../expect/cars/listCar/systemAdminSearchCarType';
import { systemAdminSortCarId } from '../../expect/cars/listCar/systemAdminSortCarId';
import { systemAdminSortCarManagementNum } from '../../expect/cars/listCar/systemAdminSortCarManagementNum';
import { transportCompanyGetAllCars } from '../../expect/cars/listCar/transportCompanyGetAllCars';
import { sample } from '../../fixture/listCars.sample';
import { systemAdminSortOwningCompanyNm } from '../../expect/cars/listCar/systemAdminSortOwningCompanyNm';

describe('Get List Car (e2e)', () => {
  let app: INestApplication;
  let mUserRepository: MUserRepository;
  let mBaseRepository: MBaseRepository;
  let mDriverRepository: MDriverRepository;
  let mTransportCompanyRepository: MTransportCompanyRepository;
  let sessionRepository: SessionRepository;
  let mCarRepository: MCarRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mUserRepository = moduleFixture.get<MUserRepository>(MUserRepository);
    mBaseRepository = moduleFixture.get<MBaseRepository>(MBaseRepository);
    mDriverRepository = moduleFixture.get<MDriverRepository>(MDriverRepository);
    mTransportCompanyRepository =
      moduleFixture.get<MTransportCompanyRepository>(
        MTransportCompanyRepository,
      );
    sessionRepository = moduleFixture.get<SessionRepository>(SessionRepository);
    mCarRepository = moduleFixture.get<MCarRepository>(MCarRepository);

    await mBaseRepository.save(sample.bases);
    await mTransportCompanyRepository.save(sample.transportCompanies);
    await mDriverRepository.save(sample.drivers);
    await mUserRepository.save(sample.users);
    await mCarRepository.save(sample.cars);
  });

  afterAll(async () => {
    await sessionRepository.delete({});
    await mUserRepository.delete({});
    await mDriverRepository.delete({});
    await mTransportCompanyRepository.delete({});
    await mBaseRepository.delete({});
    await mCarRepository.delete({});
    await app.close();
  });

  it('/cars/ (GET) - System admin get all cars', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminGetAllCars);
  });

  it('/cars/ (GET) - Kyo spacer get all cars', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.kyoSpacer)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('/cars/ (GET) - transport company get all cars', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.transportCompany)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(transportCompanyGetAllCars);
  });

  it('/cars/ (GET) - carriage company get all cars', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.carriageCompany)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(carriageCompanyGetAllCars);
  });

  it('/cars/ (GET) - System admin search car type', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ carType: CarTypeDiv.TRAILER })
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminSearchCarType);
  });

  it('/cars/ (GET) - System admin search car type', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ carSize: CarSizeDiv['1.4T'] })
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminSearchCarSize);
  });

  it('/cars/ (GET) - System admin search carManagementNum', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ carManagementNum: 'car 1' })
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminSearchCarManagementNum);
  });

  it('/cars/ (GET) - System admin sort[carId]', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ 'sort[carId]': OrderBy.ASC })
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminSortCarId);
  });

  it('/cars/ (GET) - System admin sort[carManagementNum]', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ 'sort[carManagementNum]': OrderBy.DESC })
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminSortCarManagementNum);
  });

  it('/cars/ (GET) - System admin sort[owningCompanyNm]', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ 'sort[owningCompanyNm]': OrderBy.DESC })
      .expect(200);
    const carList = response.body.data;
    expect(carList).toBeDefined();
    expect(carList.results).toEqual(systemAdminSortOwningCompanyNm);
  });
});
