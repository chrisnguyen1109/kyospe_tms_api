import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { MST_TCM002_001Exception } from '@app/common/filters/exceptions/MST_TCM002_001.exception';
import { MST_TCM002_003Exception } from '@app/common/filters/exceptions/MST_TCM002_003.exception';
import { MST_TCM002_004Exception } from '@app/common/filters/exceptions/MST_TCM002_004.exception';
import { mTransportCompanyEntityStub } from '@app/common/stubs/mTransportCompanyEntity.stub';
import { mUserEntityStub } from '@app/common/stubs/mUserEntity.stub';
import { RoleDiv } from '@app/common/types/div.type';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { faker } from '@faker-js/faker';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { CreateTransportCompanyBodyDto } from './dtos/createTransportCompanyBody.dto';
import { TransportCompanyService } from './transportCompany.service';
import { UpdateTransportCompanyBodyDto } from './dtos/updateTransportCompanyBody.dto';
import { MST_TCM002_002Exception } from '@app/common/filters/exceptions/MST_TCM002_002.exception';

describe('TransportCompanyService', () => {
  let transportCompanyService: TransportCompanyService;
  let mTransportCompanyRepository: DeepMocked<MTransportCompanyRepository>;
  let mBaseRepository: DeepMocked<MBaseRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TransportCompanyService, UserAbilityFactory],
    })
      .useMocker(createMock)
      .compile();

    transportCompanyService = module.get(TransportCompanyService);
    mTransportCompanyRepository = module.get(MTransportCompanyRepository);
    mBaseRepository = module.get(MBaseRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transportCompanyService).toBeDefined();
  });

  describe('createTransportCompany', () => {
    let currentUser: LoginUserDto;
    let body: CreateTransportCompanyBodyDto;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      body = {
        transportCompanyNm: faker.string.sample(),
        telNumber: faker.phone.number(),
      };
    });

    it('assign not found parent company', async () => {
      body.parentCompanyId = faker.number.int();
      const transportCompany = mTransportCompanyEntityStub(body);

      const mTransportCompanyCreate =
        mTransportCompanyRepository.create.mockReturnValue(transportCompany);
      const mTransportCompanyFindOneByOrThrow =
        mTransportCompanyRepository.findOneByOrThrow.mockRejectedValue(
          new MST_TCM002_001Exception(),
        );

      const response = transportCompanyService.createTransportCompany(
        currentUser,
        body,
      );

      await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
      expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
      expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
      expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    it('assign not found carriage base', async () => {
      body.carriageBaseId = faker.number.int();
      const transportCompany = mTransportCompanyEntityStub(body);

      const mTransportCompanyCreate =
        mTransportCompanyRepository.create.mockReturnValue(transportCompany);
      const mBaseFindOneByOrThrow =
        mBaseRepository.findOneByOrThrow.mockRejectedValue(
          new MST_TCM002_001Exception(),
        );

      const response = transportCompanyService.createTransportCompany(
        currentUser,
        body,
      );

      await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
      expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
      expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
      expect(mBaseFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    describe('create transport company with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('create transport company success', async () => {
        const transportCompany = mTransportCompanyEntityStub(body);

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });

      it('create carriage company success', async () => {
        body.parentCompanyId = faker.number.int();
        const transportCompany = mTransportCompanyEntityStub(body);
        const parentCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.parentCompanyId,
        });

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            parentCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });

    describe('create transport company with kyoto spacer', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      it('create transport company success', async () => {
        const transportCompany = mTransportCompanyEntityStub(body);

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });

      it('cannot create carriage company', async () => {
        body.parentCompanyId = faker.number.int();
        const transportCompany = mTransportCompanyEntityStub(body);
        const parentCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.parentCompanyId,
        });

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            parentCompany,
          );

        const response = transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(parentCompany.transportCompanyId).toBe(body.parentCompanyId);
      });
    });

    describe('create transport company with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot create transport company', async () => {
        const transportCompany = mTransportCompanyEntityStub(body);

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);

        const response = transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeUndefined();
      });

      it('cannot create carriage company in other companies', async () => {
        body.parentCompanyId = faker.number.int();
        const transportCompany = mTransportCompanyEntityStub(body);
        const parentCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.parentCompanyId,
        });

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            parentCompany,
          );

        const response = transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(parentCompany.transportCompanyId).toBe(body.parentCompanyId);
        expect(body.parentCompanyId).not.toBe(currentUser.transportCompanyId);
      });

      it('create its carriage company success', async () => {
        body.parentCompanyId = currentUser.transportCompanyId;
        const transportCompany = mTransportCompanyEntityStub(body);
        const parentCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.parentCompanyId,
        });

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            parentCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(parentCompany.transportCompanyId).toBe(body.parentCompanyId);
        expect(body.parentCompanyId).toBe(currentUser.transportCompanyId);
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
        expect(response.parentCompanyId).toBe(body.parentCompanyId);
      });
    });

    describe('create transport company with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
      });

      it('cannot create transport company', async () => {
        const transportCompany = mTransportCompanyEntityStub(body);

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);

        const response = transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeUndefined();
      });

      it('cannot create carriage company', async () => {
        body.parentCompanyId = faker.number.int();
        const transportCompany = mTransportCompanyEntityStub(body);
        const parentCompany = mTransportCompanyEntityStub({
          transportCompanyId: body.parentCompanyId,
        });

        const mTransportCompanyCreate =
          mTransportCompanyRepository.create.mockReturnValue(transportCompany);
        const mTransportCompanyFindOneByOrThrow =
          mTransportCompanyRepository.findOneByOrThrow.mockResolvedValue(
            parentCompany,
          );

        const response = transportCompanyService.createTransportCompany(
          currentUser,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_001Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyCreate).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyCreate).toHaveBeenCalledWith(body);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyFindOneByOrThrow).toHaveBeenCalledTimes(1);
        expect(parentCompany.transportCompanyId).toBe(body.parentCompanyId);
      });
    });
  });

  describe('updateTransportCompany', () => {
    let currentUser: LoginUserDto;
    let transportCompanyId: number;
    let body: UpdateTransportCompanyBodyDto;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      transportCompanyId = faker.number.int();
      body = {
        transportCompanyNm: faker.string.sample(),
        telNumber: faker.phone.number(),
      };
    });

    it('not found transport company', async () => {
      const mTransportCompanyFindOne =
        mTransportCompanyRepository.findOne.mockResolvedValue(null);

      const response = transportCompanyService.updateTransportCompany(
        currentUser,
        transportCompanyId,
        body,
      );

      await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
      expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
    });

    it('update carriage base but not found', async () => {
      body.carriageBaseId = faker.number.int();
      const transportCompany = mTransportCompanyEntityStub({
        transportCompanyId,
      });

      const mTransportCompanyFindOne =
        mTransportCompanyRepository.findOne.mockResolvedValue(transportCompany);
      const mBaseFindOneByOrThrow =
        mBaseRepository.findOneByOrThrow.mockRejectedValue(
          new MST_TCM002_002Exception(),
        );

      const response = transportCompanyService.updateTransportCompany(
        currentUser,
        transportCompanyId,
        body,
      );

      await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
      expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
      expect(mBaseFindOneByOrThrow).toHaveBeenCalledTimes(1);
    });

    describe('update transport company with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('update transport company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });

      it('update carriage company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });

    describe('update transport company with kyoto spacer', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      it('update transport company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });

      it('cannot update carriage company', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );

        const response = transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
      });
    });

    describe('update transport company with transport company role dive', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot update other transport companies', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );

        const response = transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(transportCompany.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update its transport company success', async () => {
        currentUser.transportCompanyId = transportCompanyId;
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(transportCompany.transportCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });

      it('cannot update other carriage companies', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );

        const response = transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(transportCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update its carriage company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: currentUser.transportCompanyId,
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(transportCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });

    describe('update transport company with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot update transport company', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );

        const response = transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
      });

      it('cannot update other carriage companies', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );

        const response = transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_002Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(transportCompany.transportCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
      });

      it('update its carriage company success', async () => {
        currentUser.transportCompanyId = transportCompanyId;
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOne =
          mTransportCompanyRepository.findOne.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanySave =
          mTransportCompanyRepository.save.mockImplementation();

        const response = await transportCompanyService.updateTransportCompany(
          currentUser,
          transportCompanyId,
          body,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyFindOne).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(transportCompany.transportCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mTransportCompanySave).toHaveBeenCalledTimes(1);
        expect(mTransportCompanySave).toHaveBeenCalledWith(transportCompany);
        expect(response).toBeDefined();
        expect(response).toEqual(transportCompany);
        expect(response.transportCompanyNm).toBe(body.transportCompanyNm);
        expect(response.telNumber).toBe(body.telNumber);
      });
    });
  });

  describe('deleteTransportCompany', () => {
    let currentUser: LoginUserDto;
    let transportCompanyId: number;

    beforeEach(async () => {
      currentUser = (await mUserEntityStub()).toLoginUser();
      transportCompanyId = faker.number.int();
    });

    it('not found transport company', async () => {
      const mTransportCompanyFindOneBy =
        mTransportCompanyRepository.findOneBy.mockResolvedValue(null);

      const response = transportCompanyService.deleteTransportCompany(
        currentUser,
        transportCompanyId,
      );

      await expect(response).rejects.toBeInstanceOf(MST_TCM002_003Exception);
      expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
    });

    it('cannot delete a transport company with its carriage company', async () => {
      const transportCompany = mTransportCompanyEntityStub({
        transportCompanyId,
      });

      const mTransportCompanyFindOneBy =
        mTransportCompanyRepository.findOneBy.mockResolvedValue(
          transportCompany,
        );
      const mTransportCompanyCountBy =
        mTransportCompanyRepository.countBy.mockResolvedValue(1);

      const response = transportCompanyService.deleteTransportCompany(
        currentUser,
        transportCompanyId,
      );

      await expect(response).rejects.toBeInstanceOf(MST_TCM002_004Exception);
      expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
      expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
      expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
    });

    describe('delete transport company with system admin', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.SYSTEM_ADMIN;
      });

      it('delete transport company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);
        const mTransportCompanyRemove =
          mTransportCompanyRepository.remove.mockImplementation();

        await transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledWith(transportCompany);
      });

      it('delete carriage company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);
        const mTransportCompanyRemove =
          mTransportCompanyRepository.remove.mockImplementation();

        await transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.SYSTEM_ADMIN);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledWith(transportCompany);
      });
    });

    describe('delete transport company with kyoto spacer', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.KYOTO_SPACER;
      });

      it('delete transport company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);
        const mTransportCompanyRemove =
          mTransportCompanyRepository.remove.mockImplementation();

        await transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledWith(transportCompany);
      });

      it('cannot delete carriage company', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);

        const response = transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.KYOTO_SPACER);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
      });
    });

    describe('delete transport company with transport company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.TRANSPORT_COMPANY;
        currentUser.transportCompanyId = faker.number.int();
      });

      it('cannot delete transport company', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);

        const response = transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
      });

      it('cannot delete other carriage companies', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);

        const response = transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(transportCompany.parentCompanyId).not.toBe(
          currentUser.transportCompanyId,
        );
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
      });

      it('delete its carriage company success', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: currentUser.transportCompanyId,
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);
        const mTransportCompanyRemove =
          mTransportCompanyRepository.remove.mockImplementation();

        await transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        expect(currentUser.roleDiv).toBe(RoleDiv.TRANSPORT_COMPANY);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(transportCompany.parentCompanyId).toBe(
          currentUser.transportCompanyId,
        );
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledTimes(1);
        expect(mTransportCompanyRemove).toHaveBeenCalledWith(transportCompany);
      });
    });

    describe('delete transport company with carriage company role div', () => {
      beforeEach(() => {
        currentUser.roleDiv = RoleDiv.CARRIAGE_COMPANY;
      });

      it('cannot delete transport company', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);

        const response = transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeUndefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
      });

      it('cannot delete carriage company', async () => {
        const transportCompany = mTransportCompanyEntityStub({
          transportCompanyId,
          parentCompanyId: faker.number.int(),
        });

        const mTransportCompanyFindOneBy =
          mTransportCompanyRepository.findOneBy.mockResolvedValue(
            transportCompany,
          );
        const mTransportCompanyCountBy =
          mTransportCompanyRepository.countBy.mockResolvedValue(0);

        const response = transportCompanyService.deleteTransportCompany(
          currentUser,
          transportCompanyId,
        );

        await expect(response).rejects.toBeInstanceOf(MST_TCM002_003Exception);
        expect(currentUser.roleDiv).toBe(RoleDiv.CARRIAGE_COMPANY);
        expect(mTransportCompanyFindOneBy).toHaveBeenCalledTimes(1);
        expect(transportCompany.transportCompanyId).toBe(transportCompanyId);
        expect(transportCompany.parentCompanyId).toBeDefined();
        expect(mTransportCompanyCountBy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
