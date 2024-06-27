import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { DivService } from './div.service';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { MDivValueRepository } from '@app/database/repositories/mDivValue.repository';

describe('DivService', () => {
  let divService: DivService;
  let mDivValueRepository: DeepMocked<MDivValueRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DivService],
    })
      .useMocker(createMock)
      .compile();

    divService = module.get(DivService);
    mDivValueRepository = module.get(MDivValueRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(divService).toBeDefined();
  });

  describe('get role div', () => {
    it('should return a list role div', async () => {
      const currentUser = await mUserEntityStub();

      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getRoleDivParams(
        currentUser.toLoginUser(),
      );

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('get payment method div', () => {
    it('should return a list payment method div', async () => {
      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getPaymentMethodDivParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('get dispatch status div', () => {
    it('should return a list dispatch status div', async () => {
      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getDispatchStatusDivParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('get slip status div', () => {
    it('should return a list slip status div', async () => {
      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getSlipStatusParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('get delivery div', () => {
    it('should return a list delivery div', async () => {
      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getDeliveryDivParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('get work kinds div', () => {
    it('should return a list work kinds div', async () => {
      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getWorkKindsParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });

  describe('get status div', () => {
    it('should return a list status div', async () => {
      mDivValueRepository.find.mockResolvedValue([]);

      const result = await divService.getStatusDivParams();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });
  });
});
