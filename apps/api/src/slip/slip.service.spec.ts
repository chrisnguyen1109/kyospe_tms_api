import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { SlipService } from './slip.service';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { faker } from '@faker-js/faker';
import { OrderBy } from '@app/common/types/common.type';

describe('SlipService', () => {
  let slipService: SlipService;
  let tSlipHeaderRepository: DeepMocked<TSlipHeaderRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SlipService],
    })
      .useMocker(createMock)
      .compile();

    slipService = module.get(SlipService);
    tSlipHeaderRepository = module.get(TSlipHeaderRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(slipService).toBeDefined();
  });

  describe('getListSlip', () => {
    it('should return a list of slips', async () => {
      const mockValueCount = faker.number.int();
      const query = {
        page: faker.number.int(),
        limit: faker.number.int(),
        sort: { mUserId: OrderBy.DESC },
      };

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => createQueryBuilder),
        addSelect: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoin: jest.fn().mockImplementation(() => createQueryBuilder),
        leftJoinAndMapOne: jest
          .fn()
          .mockImplementation(() => createQueryBuilder),
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
        .spyOn(tSlipHeaderRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = await slipService.getListSlips(query);

      expect(tSlipHeaderRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.results).toEqual([]);
      expect(result.pagination).toBeDefined();
    });
  });
});
