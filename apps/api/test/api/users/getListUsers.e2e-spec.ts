import { AppModule } from '@api/app.module';
import { RoleDiv } from '@app/common/types/div.type';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { SessionRepository } from '@app/database/repositories/session.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { carriageCompanyGetAllUsers } from '../../expect/users/listUser/carriageCompanyGetAllUsers';
import { kyoSpacerGetAllUsers } from '../../expect/users/listUser/kyoSpacerGetAllUsers';
import { pagination } from '../../expect/users/listUser/pagination';
import { systemAdminGetAllUsers } from '../../expect/users/listUser/systemAdminGetAllUsers';
import { systemAdminSearchMailAddress } from '../../expect/users/listUser/systemAdminSearchMailAddress';
import { systemAdminSearchRoleDiv01 } from '../../expect/users/listUser/systemAdminSearchRoleDiv01';
import { systemAdminSearchRoleDiv02 } from '../../expect/users/listUser/systemAdminSearchRoleDiv02';
import { systemAdminSearchRoleDiv03 } from '../../expect/users/listUser/systemAdminSearchRoleDiv03';
import { systemAdminSearchRoleDiv04 } from '../../expect/users/listUser/systemAdminSearchRoleDiv04';
import { systemAdminSearchTransportCompanyId } from '../../expect/users/listUser/systemAdminSearchTransportCompanyId';
import { systemAdminSearchUserId } from '../../expect/users/listUser/systemAdminSearchUserId';
import { systemAdminSearchUserNm } from '../../expect/users/listUser/systemAdminSearchUserNm';
import { systemAdminSearchUserNmKn } from '../../expect/users/listUser/systemAdminSearchUserNmKn';
import { transportCompanyGetAllUsers } from '../../expect/users/listUser/transportCompanyGetAllUsers';
import { sample } from '../../fixture/listUsers.sample';

describe('Get List User (e2e)', () => {
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
    await mCarRepository.save(sample.cars);
    await mDriverRepository.save(sample.drivers);
    await mUserRepository.save(sample.users);
  });

  afterAll(async () => {
    await sessionRepository.delete({});
    await mUserRepository.delete({});
    await mDriverRepository.delete({});
    await mCarRepository.delete({});
    await mTransportCompanyRepository.delete({});
    await mBaseRepository.delete({});
    await app.close();
  });

  it('/users/ (GET) - System admin get all users', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminGetAllUsers);
  });

  it('/users/ (GET) - Kyo spacer get all users', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.kyoSpacer)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(kyoSpacerGetAllUsers);
  });

  it('/users/ (GET) - transportCompany get all users', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.transportCompany)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(transportCompanyGetAllUsers);
  });

  it('/users/ (GET) - carriageCompany get all users', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.carriageCompany)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(carriageCompanyGetAllUsers);
  });

  it('/users/ (GET) - Pagination', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 2, limit: 3 })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(pagination);
  });

  it('/users/ (GET) - System admin search roleDiv 01', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ roleDiv: RoleDiv.SYSTEM_ADMIN })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchRoleDiv01);
  });

  it('/users/ (GET) - System admin search roleDiv 02', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ roleDiv: RoleDiv.KYOTO_SPACER })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchRoleDiv02);
  });

  it('/users/ (GET) - System admin search roleDiv 03', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ roleDiv: RoleDiv.TRANSPORT_COMPANY })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchRoleDiv03);
  });

  it('/users/ (GET) - System admin search roleDiv 04', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ roleDiv: RoleDiv.CARRIAGE_COMPANY })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchRoleDiv04);
  });

  it('/users/ (GET) - System admin search roleDiv 04', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ roleDiv: RoleDiv.CARRIAGE_COMPANY })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchRoleDiv04);
  });

  it('/users/ (GET) - System admin search mailAddress', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ mailAddress: 'carriage-employee3@gmail.com' })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchMailAddress);
  });

  it('/users/ (GET) - System admin search userId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ userId: 'carriage-employee4' })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchUserId);
  });

  it('/users/ (GET) - System admin search userNm', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ userNm: 'carriage-employee4' })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchUserNm);
  });

  it('/users/ (GET) - System admin search userNmKn', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ userNmKn: 'carriage-employee4' })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchUserNmKn);
  });

  it('/users/ (GET) - System admin search transportCompanyId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sample.loginUser.systemAdmin)
      .expect(200);
    const accessToken = loginResponse.body.data.accessToken;
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ transportCompanyId: 2 })
      .expect(200);
    const userList = response.body.data;
    expect(userList).toBeDefined();
    expect(userList.results).toEqual(systemAdminSearchTransportCompanyId);
  });
});
