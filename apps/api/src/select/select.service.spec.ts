import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { SelectService } from './select.service';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCourseRepository } from '@app/database/repositories/mCourse.repository';

describe('SelectService', () => {
  let selectService: SelectService;
  let mBaseRepository: DeepMocked<MBaseRepository>;
  let mDriverRepository: DeepMocked<MDriverRepository>;
  let mCarRepository: DeepMocked<MCarRepository>;
  let mTransportCompanyRepository: DeepMocked<MTransportCompanyRepository>;
  let mCourseseRepository: DeepMocked<MCourseRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SelectService],
    })
      .useMocker(createMock)
      .compile();

    selectService = module.get(SelectService);
    mBaseRepository = module.get(MBaseRepository);
    mDriverRepository = module.get(MDriverRepository);
    mCarRepository = module.get(MCarRepository);
    mTransportCompanyRepository = module.get(MTransportCompanyRepository);
    mCourseseRepository = module.get(MCourseRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(selectService).toBeDefined();
  });

  describe('mBaseRepository', () => {
    it('should return a list base params', async () => {
      mBaseRepository.find.mockResolvedValue([]);

      const result = await selectService.getBaseParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('getDriveParmas', () => {
    it('should return a list driver params', async () => {
      const currentUser = await mUserEntityStub();

      const listDriverParamsQuery = {
        transportCompanyId: 1,
      };

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoin: jest.fn().mockImplementation(() => createQueryBuilder),
        where: jest.fn().mockImplementation(() => createQueryBuilder),
        orWhere: jest.fn().mockImplementation(() => createQueryBuilder),
        andWhere: jest.fn().mockImplementation(() => createQueryBuilder),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(mDriverRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      mDriverRepository.find.mockResolvedValue([]);

      const result = await selectService.getDriverParams(
        currentUser.toLoginUser(),
        listDriverParamsQuery,
      );

      expect(mDriverRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('getCarParmas', () => {
    it('should return a list car params', async () => {
      const currentUser = await mUserEntityStub();
      const carQuery = {};

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoin: jest.fn().mockImplementation(() => createQueryBuilder),
        where: jest.fn().mockImplementation(() => createQueryBuilder),
        orWhere: jest.fn().mockImplementation(() => createQueryBuilder),
        andWhere: jest.fn().mockImplementation(() => createQueryBuilder),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(mCarRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      mCarRepository.find.mockResolvedValue([]);

      const result = await selectService.getCarParams(
        currentUser.toLoginUser(),
        carQuery,
      );

      expect(mCarRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('getTransportParmas', () => {
    it('should return a list car params', async () => {
      const currentUser = await mUserEntityStub();

      mTransportCompanyRepository.find.mockResolvedValue([]);

      const result = await selectService.getTransportCompanyParams(
        currentUser.toLoginUser(),
      );

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('getParentCompanyParams', () => {
    it('should return a list car params', async () => {
      const currentUser = await mUserEntityStub();

      mTransportCompanyRepository.find.mockResolvedValue([]);

      const result = await selectService.getParentCompanyParams(
        currentUser.toLoginUser(),
      );

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('getCarriageCompanyParams', () => {
    it('should return a list car params', async () => {
      const currentUser = await mUserEntityStub();

      mTransportCompanyRepository.find.mockResolvedValue([]);

      const result = await selectService.getCarriageCompanyParams(
        currentUser.toLoginUser(),
      );

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('getCourseParams', () => {
    it('should return a list course params', async () => {
      const currentUser = await mUserEntityStub();

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoin: jest.fn().mockImplementation(() => createQueryBuilder),
        where: jest.fn().mockImplementation(() => createQueryBuilder),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(mCourseseRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      mCourseseRepository.find.mockResolvedValue([]);

      const result = await selectService.getCourseParams(currentUser);

      expect(mCourseseRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });
});
