import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { DivCd, RoleDiv } from '@app/common/types/div.type';
import { MDivValueRepository } from '@app/database/repositories/mDivValue.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DivService {
  constructor(private readonly mDivValueRepository: MDivValueRepository) {}

  async getRoleDivParams(currentUser: LoginUserDto) {
    let roleDivs = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.ROLE_DIV,
      },
    });

    switch (currentUser.roleDiv) {
      case RoleDiv.KYOTO_SPACER:
        roleDivs = roleDivs.filter(
          roleDiv => roleDiv.divValue !== RoleDiv.SYSTEM_ADMIN,
        );
        break;

      case RoleDiv.TRANSPORT_COMPANY:
        roleDivs = roleDivs.filter(
          roleDiv =>
            roleDiv.divValue !== RoleDiv.SYSTEM_ADMIN &&
            roleDiv.divValue !== RoleDiv.KYOTO_SPACER,
        );
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        roleDivs = roleDivs.filter(
          roleDiv => roleDiv.divValue === RoleDiv.CARRIAGE_COMPANY,
        );
        break;

      default:
        break;
    }

    return roleDivs;
  }

  async getDeliveryStatusDivParams() {
    const deliveryDivs = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.DELIVERY_STATUS_DIV,
      },
    });

    return deliveryDivs;
  }

  async getDispatchStatusDivParams() {
    const dispatchDivs = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.DISPATCH_STATUS_DIV,
      },
    });

    return dispatchDivs;
  }

  async getPaymentMethodDivParams() {
    const deliveryDivs = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.PAYMENT_METHOD_DIV,
      },
    });

    return deliveryDivs;
  }

  async getDeliveryDivParams() {
    const deliveryDivs = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.DELIVERY_DIV,
      },
    });

    return deliveryDivs;
  }

  async getCarSizeParams() {
    const carSizes = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.CARSIZE_DIV,
      },
    });

    return carSizes;
  }

  async getCarTypeParams() {
    const carTypes = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.CARTYPE_DIV,
      },
    });

    return carTypes;
  }
  async getSlipStatusParams() {
    const slipStatus = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.SLIP_STATUS_DIV,
      },
    });

    return slipStatus;
  }

  async getWorkKindsParams() {
    const workKinds = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.WORK_KINDS_DIV,
      },
    });

    return workKinds;
  }

  async getStatusDivParams() {
    const statusDivs = await this.mDivValueRepository.find({
      select: ['divValue', 'divValueNm'],
      where: {
        divCd: DivCd.STATUS_DIV,
      },
    });

    return statusDivs;
  }
}
