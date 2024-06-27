import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_CAR002_001Exception } from '@app/common/filters/exceptions/MST_CAR002_001.exception';
import { MST_CAR002_002Exception } from '@app/common/filters/exceptions/MST_CAR002_002.exception';
import { MST_CAR002_003Exception } from '@app/common/filters/exceptions/MST_CAR002_003.exception';
import { mCarEntityStub } from '@app/common/stubs/mCar.stub';
import { mTransportCompanyEntityStub } from '@app/common/stubs/mTransportCompanyEntity.stub';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { OrderBy } from '@app/common/types/common.type';
import { CarSizeDiv, CarTypeDiv, RoleDiv } from '@app/common/types/div.type';
import { getPagination } from '@app/common/utils/getPagination.util';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { faker } from '@faker-js/faker';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { CarService } from './car.service';
import { CreateCarBodyDto } from './dtos/createCarBody.dto';
import { UpdateCarBodyDto } from './dtos/updateCarBody.dto';

describe('CarService', () => {
  let carService: CarService;
  let mCarRepository: DeepMocked<MCarRepository>;
  let mTransportCompanyRepository: DeepMocked<MTransportCompanyRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CarService, UserAbilityFactory],
    })
      .useMocker(createMock)
      .compile();

    carService = module.get(CarService);
    mCarRepository = module.get(MCarRepository);
    mTransportCompanyRepository = module.get(MTransportCompanyRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(carService).toBeDefined();
  });

  describe('getListCar', () => {
    it('should return a list of cars', async () => {
      const currentUser = await mUserEntityStub();
      const mockValueCount = faker.number.int();
      const listUserQuery = {
        page: faker.number.int(),
        limit: faker.number.int(),
        sort: { carId: OrderBy.DESC },
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
        .spyOn(mCarRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = await carService.getListCars(
        currentUser.toLoginUser(),
        listUserQuery,
      );

      const pagination = getPagination(
        result.results.length,
        mockValueCount,
        listUserQuery.page,
        listUserQuery.limit,
      );

      expect(mCarRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.results).toEqual([]);
      expect(result.pagination).toBeDefined();
      expect(result.pagination).toEqual(pagination);
    });
  });

  describe('createCar', () => {
    let currentUser: LoginUserDto;
    let body: CreateCarBodyDto;
    let transportCompany: MTransportCompanyEntity;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      body = {
        carManagementNum: faker.string.sample(),
        owningCompanyId: faker.number.int(),
        carSize: faker.helpers.enumValue(CarSizeDiv),
        carType: faker.helpers.enumValue(CarTypeDiv),
      };
      transportCompany = mTransportCompanyEntityStub({
        transportCompanyId: body.owningCompanyId,
      });
    });

    it('not found owning company', async () => {
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockRejectedValue(
          new MST_CAR002_001Exception(),
        );

      const response = carService.createCar(currentUser, body);

      await expect(response).rejects.toBeInstanceOf(MST_CAR002_001Exception);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    describe('create car with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('create car success', async () => {
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.createCar(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
        expect(response.owningCompanyId).toBe(body.owningCompanyId);
        expect(response.carSize).toBe(body.carSize);
        expect(response.carType).toBe(body.carType);
      });
    });

    describe('create car with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot create car in other transport companies', async () => {
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );

        const response = carService.createCar(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(car.owningCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('create car in its transport company success', async () => {
        currentUser.transportCompanyId = body.owningCompanyId;
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.createCar(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(car.owningCompanyId).toBe(currentUser.transportCompanyId);
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
        expect(response.owningCompanyId).toBe(body.owningCompanyId);
        expect(response.carSize).toBe(body.carSize);
        expect(response.carType).toBe(body.carType);
      });

      it('cannot create car in other carriage companies', async () => {
        transportCompany.parentCompanyId = faker.number.int();
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );

        const response = carService.createCar(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(car.owningCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('create car in its other carriage company success', async () => {
        transportCompany.parentCompanyId = currentUser.transportCompanyId;
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.createCar(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(car.owningCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
        expect(response.owningCompanyId).toBe(body.owningCompanyId);
        expect(response.carSize).toBe(body.carSize);
        expect(response.carType).toBe(body.carType);
      });
    });

    describe('create car with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot create car in other companies', async () => {
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );

        const response = carService.createCar(currentUser, body);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(car.owningCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('create car in its company success', async () => {
        currentUser.transportCompanyId = body.owningCompanyId;
        const car = mCarEntityStub(body as any);

        const mCarCreate = mCarRepository.create.mockReturnValue(car);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            transportCompany,
          );
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.createCar(currentUser, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mCarCreate).toHaveBeenCalledTimes(1);
        expect(mCarCreate).toHaveBeenCalledWith(body);
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(body.owningCompanyId);
        expect(car.owningCompanyId).toBe(currentUser.transportCompanyId);
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
        expect(response.owningCompanyId).toBe(body.owningCompanyId);
        expect(response.carSize).toBe(body.carSize);
        expect(response.carType).toBe(body.carType);
      });
    });
  });

  describe('updateCar', () => {
    let currentUser: LoginUserDto;
    let carId: number;
    let body: UpdateCarBodyDto;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      carId = faker.number.int();
      body = {
        carManagementNum: faker.string.sample(),
      };
    });

    it('not found car', async () => {
      const mCarFindOne = mCarRepository.findOne.mockResolvedValue(null);

      const response = carService.updateCar(currentUser, carId, body);

      await expect(response).rejects.toBeInstanceOf(MST_CAR002_002Exception);
      expect(mCarFindOne).toHaveBeenCalledTimes(1);
    });

    describe('update car with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('update car success', async () => {
        const car = mCarEntityStub({ carId });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.updateCar(currentUser, carId, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
      });
    });

    describe('update car with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot update car in other transport companies', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: faker.number.int(),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);

        const response = carService.updateCar(currentUser, carId, body);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('update car in its transport company success', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: currentUser.transportCompanyId,
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.updateCar(currentUser, carId, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
      });

      it('cannot update car in other carriage companies', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompany: mTransportCompanyEntityStub({
            parentCompanyId: faker.number.int(),
          }),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);

        const response = carService.updateCar(currentUser, carId, body);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompany.parentCompanyId).toBeDefined();
        expect(car.owningCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update car in its other carriage company success', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompany: mTransportCompanyEntityStub({
            parentCompanyId: currentUser.transportCompanyId,
          }),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.updateCar(currentUser, carId, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompany.parentCompanyId).toBeDefined();
        expect(car.owningCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
      });
    });

    describe('update car with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot update car in other companies', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: faker.number.int(),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);

        const response = carService.updateCar(currentUser, carId, body);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('update car in its company success', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: currentUser.transportCompanyId,
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarSave = mCarRepository.save.mockImplementation();

        const response = await carService.updateCar(currentUser, carId, body);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(mCarSave).toHaveBeenCalledTimes(1);
        expect(mCarSave).toHaveBeenCalledWith(car);
        expect(response).toBeDefined();
        expect(response).toEqual(car);
        expect(response.carManagementNum).toBe(body.carManagementNum);
      });
    });
  });

  describe('deleteCar', () => {
    let currentUser: LoginUserDto;
    let carId: number;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      carId = faker.number.int();
    });

    it('not found car', async () => {
      const mCarFindOne = mCarRepository.findOne.mockResolvedValue(null);

      const response = carService.deleteCar(currentUser, carId);

      await expect(response).rejects.toBeInstanceOf(MST_CAR002_003Exception);
      expect(mCarFindOne).toHaveBeenCalledTimes(1);
    });

    describe('delete car with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('delete car success', async () => {
        const car = mCarEntityStub({ carId });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarRemove = mCarRepository.remove.mockImplementation();

        await carService.deleteCar(currentUser, carId);

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(mCarRemove).toHaveBeenCalledTimes(1);
        expect(mCarRemove).toHaveBeenCalledWith(car);
      });
    });

    describe('delete car with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete car in other transport companies', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: faker.number.int(),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);

        const response = carService.deleteCar(currentUser, carId);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('delete car in its transport company success', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: currentUser.transportCompanyId,
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarRemove = mCarRepository.remove.mockImplementation();

        await carService.deleteCar(currentUser, carId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompanyId).toBe(currentUser.transportCompanyId);
        expect(mCarRemove).toHaveBeenCalledTimes(1);
        expect(mCarRemove).toHaveBeenCalledWith(car);
      });

      it('cannot delete car in other carriage companies', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompany: mTransportCompanyEntityStub({
            parentCompanyId: faker.number.int(),
          }),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);

        const response = carService.deleteCar(currentUser, carId);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompany.parentCompanyId).toBeDefined();
        expect(car.owningCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('delete car in its other carriage company success', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompany: mTransportCompanyEntityStub({
            parentCompanyId: currentUser.transportCompanyId,
          }),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarRemove = mCarRepository.remove.mockImplementation();

        await carService.deleteCar(currentUser, carId);

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompany.parentCompanyId).toBeDefined();
        expect(car.owningCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mCarRemove).toHaveBeenCalledTimes(1);
        expect(mCarRemove).toHaveBeenCalledWith(car);
      });
    });

    describe('delete car with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete car in other companies', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: faker.number.int(),
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);

        const response = carService.deleteCar(currentUser, carId);

        await expect(response).rejects.toBeInstanceOf(MST_CAR002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('delete car in its company success', async () => {
        const car = mCarEntityStub({
          carId,
          owningCompanyId: currentUser.transportCompanyId,
        });

        const mCarFindOne = mCarRepository.findOne.mockResolvedValue(car);
        const mCarRemove = mCarRepository.remove.mockImplementation();

        await carService.deleteCar(currentUser, carId);

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mCarFindOne).toHaveBeenCalledTimes(1);
        expect(car.carId).toBe(carId);
        expect(car.owningCompanyId).toBe(currentUser.transportCompanyId);
        expect(mCarRemove).toHaveBeenCalledTimes(1);
        expect(mCarRemove).toHaveBeenCalledWith(car);
      });
    });
  });
});
