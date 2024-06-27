import { AppModule } from '@api/app.module';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { sample } from '../../fixture/listCars.sample';
import { OrderBy } from '@app/common/types/common.type';

describe('Get List Course (e2e)', () => {
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

  it('/course/ (GET) - System admin get all course', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - Kyoto spacer get all course', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.kyoSpacer)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - transport company get all course', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.transportCompany)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - carriage company get all course', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.carriageCompany)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - System admin get by courseId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .query({ courseId: 1 })
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - System admin get by transportCompanyId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .query({ transportCompanyId: 1 })
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - System admin get by startBaseId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .query({ startBaseId: 1 })
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - System admin get by arriveBaseId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .query({ arriveBaseId: 1 })
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - System admin get by slipNo', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .query({ slipNo: 1 })
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });

  it('/course/ (GET) - System admin get sort', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .query({
        'sort[serviceYmd]': OrderBy.ASC,
        'sort[courseId]': OrderBy.ASC,
        'sort[dispatchStatusDivNm]': OrderBy.ASC,
        'sort[deliveryStatusDivNm]': OrderBy.ASC,
        'sort[deliveryCompany]': OrderBy.ASC,
        'sort[driverNm]': OrderBy.ASC,
        'sort[carManagementNum]': OrderBy.ASC,
        'sort[specialDateSlip]': OrderBy.ASC,
        'sort[totalSlip]': OrderBy.ASC,
        'sort[visitedCases]': OrderBy.ASC,
        'sort[numReturnedSlip]': OrderBy.ASC,
        'sort[startTime]': OrderBy.ASC,
        'sort[endTime]': OrderBy.ASC,
        'sort[highwayFee]': OrderBy.ASC,
        'sort[startPoint]': OrderBy.ASC,
        'sort[arrivePoint]': OrderBy.ASC,
        'sort[signboardPhoto]': OrderBy.ASC,
      })
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const courseList = response.body.data;
    expect(courseList).toBeDefined();
  });
});
