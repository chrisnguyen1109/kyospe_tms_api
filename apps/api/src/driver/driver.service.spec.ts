import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_DRV002_001Exception } from '@app/common/filters/exceptions/MST_DRV002_001.exception';
import { MST_DRV002_002Exception } from '@app/common/filters/exceptions/MST_DRV002_002.exception';
import { MST_DRV002_003Exception } from '@app/common/filters/exceptions/MST_DRV002_003.exception';
import { mCarEntityStub } from '@app/common/stubs/mCar.stub';
import { mDriverEntityStub } from '@app/common/stubs/mDriver.stub';
import { mTransportCompanyEntityStub } from '@app/common/stubs/mTransportCompanyEntity.stub';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { OrderBy } from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import { getPagination } from '@app/common/utils/getPagination.util';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { faker } from '@faker-js/faker';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { DriverService } from './driver.service';
import { CreateDriverBodyDto } from './dtos/createDriverBody.dto';
import { UpdateDriverBody } from './dtos/updateDriverBody.dto';

describe('DriverService', () => {
  let driverService: DriverService;
  let mDriverRepository: DeepMocked<MDriverRepository>;
  let mTransportCompanyRepository: DeepMocked<MTransportCompanyRepository>;
  let mCarRepository: DeepMocked<MCarRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DriverService, UserAbilityFactory],
    })
      .useMocker(createMock)
      .compile();

    driverService = module.get(DriverService);
    mDriverRepository = module.get(MDriverRepository);
    mTransportCompanyRepository = module.get(MTransportCompanyRepository);
    mCarRepository = module.get(MCarRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(driverService).toBeDefined();
  });

  describe('getListDriver', () => {
    it('should return a list of drivers', async () => {
      const currentUser = await mUserEntityStub();
      const mockValueCount = faker.number.int();
      const listUserQuery = {
        page: faker.number.int(),
        limit: faker.number.int(),
        sort: { driverId: OrderBy.DESC },
      };
      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => createQueryBuilder),
        addSelect: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoin: jest.fn().mockImplementation(() => createQueryBuilder),
        addOrderBy: jest.fn().mockImplementation(() => createQueryBuilder),
        limit: jest.fn().mockImplementation(() => createQueryBuilder),
        offset: jest.fn().mockImplementation(() => createQueryBuilder),
        take: jest.fn().mockImplementation(() => createQueryBuilder),
        groupBy: jest.fn().mockImplementation(() => createQueryBuilder),
        skip: jest.fn().mockImplementation(() => createQueryBuilder),
        where: jest.fn().mockImplementation(() => createQueryBuilder),
        andWhere: jest.fn().mockImplementation(() => createQueryBuilder),
        getCount: jest.fn().mockResolvedValue(mockValueCount),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(mDriverRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = await driverService.getListDrivers(
        currentUser.toLoginUser(),
        listUserQuery,
      );

      const pagination = getPagination(
        result.results.length,
        mockValueCount,
        listUserQuery.page,
        listUserQuery.limit,
      );

      expect(mDriverRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.results).toEqual([]);
      expect(result.pagination).toBeDefined();
      expect(result.pagination).toEqual(pagination);
    });
  });

  describe('createDriver', () => {
    let currentUser: LoginUserDto;
    let body: CreateDriverBodyDto;
    let transportCompany: MTransportCompanyEntity;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      body = {
        driverNm: faker.string.sample(),
        driverNmKn: faker.string.sample(),
        transportCompanyId: faker.number.int(),
      };
      transportCompany = mTransportCompanyEntityStub({
        transportCompanyId: body.transportCompanyId,
      });
    });

    it('not found transport company', async () => {
      const driver = mDriverEntityStub(body);

      const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockRejectedValue(
          new MST_DRV002_001Exception(),
        );

      const response = driverService.createDriver(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_001Exception);
      expect(mDriverCreate).toHaveBeenCalledTimes(1);
      expect(mDriverCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    it('assign car but not found', async () => {
      body.carId = faker.number.int();
      const driver = mDriverEntityStub(body);

      const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
          transportCompany,
        );
      const mCarFindOneByOrThrow =
        mCarRepository.findOneByOrThrow.mockRejectedValue(
          new MST_DRV002_001Exception(),
        );

      const response = driverService.createDriver(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_001Exception);
      expect(mDriverCreate).toHaveBeenCalledTimes(1);
      expect(mDriverCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(body.transportCompanyId);
      expect(mCarFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    it('assign car but in different companies', async () => {
      body.carId = faker.number.int();
      const driver = mDriverEntityStub(body);
      const car = mCarEntityStub({
        carId: body.carId,
        owningCompanyId: faker.number.int(),
      });

      const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
          transportCompany,
        );
      const mCarFindOneByOrThrow =
        mCarRepository.findOneByOrThrow.mockResolvedValue(car);

      const response = driverService.createDriver(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_001Exception);
      expect(mDriverCreate).toHaveBeenCalledTimes(1);
      expect(mDriverCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(body.transportCompanyId);
      expect(mCarFindOneByOrThrow).toHaveBeenCalledTimes(1);
      expect(car.carId).toBe(body.carId);
      expect(car.owningCompanyId).not.toBe(body.transportCompanyId);
    });

    describe('create driver with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('create driver success', async () => {
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.createDriver(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.driverNmKn).toBe(body.driverNmKn);
        expect(response.transportCompanyId).toBe(body.transportCompanyId);
      });

      it('create driver with car success', async () => {
        body.carId = faker.number.int();
        const driver = mDriverEntityStub(body);
        const car = mCarEntityStub({
          carId: body.carId,
          owningCompanyId: body.transportCompanyId,
        });

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mCarFindOneByOrThrow =
          mCarRepository.findOneByOrThrow.mockResolvedValue(car);
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.createDriver(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(mCarFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(body.carId);
        expect(car.owningCompanyId).toBe(body.transportCompanyId);
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.driverNmKn).toBe(body.driverNmKn);
        expect(response.transportCompanyId).toBe(body.transportCompanyId);
        expect(response.carId).toBe(body.carId);
      });
    });

    describe('create driver with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot create driver in other transport companies', async () => {
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );

        const response = driverService.createDriver(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(driver.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('create driver in its transport company success', async () => {
        currentUser.transportCompanyId = body.transportCompanyId;
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.createDriver(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(driver.transportCompanyId).toBe(currentUser.transportCompanyId);
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.driverNmKn).toBe(body.driverNmKn);
        expect(response.transportCompanyId).toBe(body.transportCompanyId);
      });

      it('cannot create driver in other carriage companies', async () => {
        transportCompany.parentCompanyId = faker.number.int();
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );

        const response = driverService.createDriver(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('create driver in its carriage company success', async () => {
        transportCompany.parentCompanyId = currentUser.transportCompanyId;
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.createDriver(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.driverNmKn).toBe(body.driverNmKn);
        expect(response.transportCompanyId).toBe(body.transportCompanyId);
      });
    });

    describe('create driver with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        transportCompany.parentCompanyId = faker.number.int();
      });

      it('cannot create driver in other companies', async () => {
        currentUser.transportCompanyId = faker.number.int();
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );

        const response = driverService.createDriver(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('create driver in its company success', async () => {
        currentUser.transportCompanyId = body.transportCompanyId;
        const driver = mDriverEntityStub(body);

        const mDriverCreate = mDriverRepository.create.mockReturnValue(driver);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.createDriver(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mDriverCreate).toHaveBeenCalledTimes(1);
        expect(mDriverCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(
          body.transportCompanyId,
        );
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompanyId).toBe(currentUser.transportCompanyId);
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.driverNmKn).toBe(body.driverNmKn);
        expect(response.transportCompanyId).toBe(body.transportCompanyId);
      });
    });
  });

  describe('updateDriver', () => {
    let currentUser: LoginUserDto;
    let driverId: number;
    let body: UpdateDriverBody;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      driverId = faker.number.int();
      body = {
        driverNm: faker.string.sample(),
        telNumber: faker.phone.number(),
      };
    });

    it('not found driver', async () => {
      const mDriverFindOne = mDriverRepository.findOne.mockResolvedValue(null);

      const response = driverService.updateDriver(currentUser, driverId, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
      expect(mDriverFindOne).toHaveBeenCalledTimes(1);
    });

    it('update transport company but not found', async () => {
      body.transportCompanyId = faker.number.int();
      const driver = mDriverEntityStub({ driverId });

      const mDriverFindOne =
        mDriverRepository.findOne.mockResolvedValue(driver);
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockRejectedValue(
          new MST_DRV002_002Exception(),
        );

      const response = driverService.updateDriver(currentUser, driverId, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
      expect(mDriverFindOne).toHaveBeenCalledTimes(1);
      expect(driver.driverId).toBe(driverId);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    it('update transport company and car, found company but not found car', async () => {
      body.transportCompanyId = faker.number.int();
      body.carId = faker.number.int();
      const driver = mDriverEntityStub({ driverId });
      const transportCompany = mTransportCompanyEntityStub({
        transportCompanyId: body.transportCompanyId,
      });

      const mDriverFindOne =
        mDriverRepository.findOne.mockResolvedValue(driver);
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
          transportCompany,
        );
      const mCarFindOneByOrThrow =
        mCarRepository.findOneByOrThrow.mockRejectedValue(
          new MST_DRV002_002Exception(),
        );

      const response = driverService.updateDriver(currentUser, driverId, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
      expect(mDriverFindOne).toHaveBeenCalledTimes(1);
      expect(driver.driverId).toBe(driverId);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(body.transportCompanyId);
      expect(mCarFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    it("update car but transport company and car's company is not match", async () => {
      body.carId = faker.number.int();
      const driver = mDriverEntityStub({
        driverId,
        transportCompanyId: faker.number.int(),
      });
      const car = mCarEntityStub({
        carId: body.carId,
        owningCompanyId: faker.number.int(),
      });

      const mDriverFindOne =
        mDriverRepository.findOne.mockResolvedValue(driver);
      const mCarFindOneByOrThrow =
        mCarRepository.findOneByOrThrow.mockRejectedValue(
          new MST_DRV002_002Exception(),
        );

      const response = driverService.updateDriver(currentUser, driverId, body);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
      expect(mDriverFindOne).toHaveBeenCalledTimes(1);
      expect(driver.driverId).toBe(driverId);
      expect(mCarFindOneByOrThrow).toHaveBeenCalledTimes(1);
      expect(car.carId).toBe(body.carId);
      expect(driver.transportCompanyId).not.toBe(car.owningCompanyId);
    });

    describe('update driver with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('update driver success', async () => {
        const driver = mDriverEntityStub({ driverId });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });

    describe('update driver with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot update driver in other transport companies', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: faker.number.int(),
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);

        const response = driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update driver in its transport company success', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: currentUser.transportCompanyId,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).toBe(currentUser.transportCompanyId);
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.telNumber).toBe(body.telNumber);
      });

      it('cannot update driver in other carriage companies', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: faker.number.int(),
        });
        const driver = mDriverEntityStub({
          driverId,
          transportCompany,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);

        const response = driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update driver in its carriage company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: currentUser.transportCompanyId,
        });
        const driver = mDriverEntityStub({
          driverId,
          transportCompany,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });

    describe('update driver with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot update driver in other companies', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: faker.number.int(),
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);

        const response = driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update driver in its company success', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: currentUser.transportCompanyId,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverSave = mDriverRepository.save.mockImplementation();

        const response = await driverService.updateDriver(
          currentUser,
          driverId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).toBe(currentUser.transportCompanyId);
        expect(mDriverSave).toHaveBeenCalledTimes(1);
        expect(mDriverSave).toHaveBeenCalledWith(driver);
        expect(response).toBeDefined();
        expect(response).toEqual(driver);
        expect(response.driverNm).toBe(body.driverNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });
  });

  describe('deleteDriver', () => {
    let currentUser: LoginUserDto;
    let driverId: number;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      driverId = faker.number.int();
    });

    it('not found driver', async () => {
      const mDriverFindOne = mDriverRepository.findOne.mockResolvedValue(null);

      const response = driverService.deleteDriver(currentUser, driverId);

      await expect(response).rejects.toBeInstanceOf(MST_DRV002_003Exception);
      expect(mDriverFindOne).toHaveBeenCalledTimes(1);
    });

    describe('delete driver with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('delete driver success', async () => {
        const driver = mDriverEntityStub({ driverId });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverRemove = mDriverRepository.remove.mockImplementation();

        await driverService.deleteDriver(currentUser, driverId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(mDriverRemove).toHaveBeenCalledTimes(1);
        expect(mDriverRemove).toHaveBeenCalledWith(driver);
      });
    });

    describe('delete driver with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete driver in other transport companies', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: faker.number.int(),
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);

        const response = driverService.deleteDriver(currentUser, driverId);

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('delete driver in its transport company success', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: currentUser.transportCompanyId,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverRemove = mDriverRepository.remove.mockImplementation();

        await driverService.deleteDriver(currentUser, driverId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).toBe(currentUser.transportCompanyId);
        expect(mDriverRemove).toHaveBeenCalledTimes(1);
        expect(mDriverRemove).toHaveBeenCalledWith(driver);
      });

      it('cannot delete driver in other carriage companies', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: faker.number.int(),
        });
        const driver = mDriverEntityStub({
          driverId,
          transportCompany,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);

        const response = driverService.deleteDriver(currentUser, driverId);

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('delete driver in its carriage company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          parentCompanyId: currentUser.transportCompanyId,
        });
        const driver = mDriverEntityStub({
          driverId,
          transportCompany,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverRemove = mDriverRepository.remove.mockImplementation();

        await driverService.deleteDriver(currentUser, driverId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompany.parentCompanyId).toBeDefined();
        expect(driver.transportCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mDriverRemove).toHaveBeenCalledTimes(1);
        expect(mDriverRemove).toHaveBeenCalledWith(driver);
      });
    });

    describe('delete driver with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete driver in other companies', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: faker.number.int(),
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);

        const response = driverService.deleteDriver(currentUser, driverId);

        await expect(response).rejects.toBeInstanceOf(MST_DRV002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('delete driver in its company success', async () => {
        const driver = mDriverEntityStub({
          driverId,
          transportCompanyId: currentUser.transportCompanyId,
        });

        const mDriverFindOne =
          mDriverRepository.findOne.mockResolvedValue(driver);
        const mDriverRemove = mDriverRepository.remove.mockImplementation();

        await driverService.deleteDriver(currentUser, driverId);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mDriverFindOne).toHaveBeenCalledTimes(1);
        expect(driver.driverId).toBe(driverId);
        expect(driver.transportCompanyId).toBe(currentUser.transportCompanyId);
        expect(mDriverRemove).toHaveBeenCalledTimes(1);
        expect(mDriverRemove).toHaveBeenCalledWith(driver);
      });
    });
  });
});
