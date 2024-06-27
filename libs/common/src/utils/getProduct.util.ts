import { TSlipDetailEntity } from '@app/database/entities/tSlipDetail.entity';
import { ProductDto } from '../dtos/commonSpotResponse.dto';
import { DeliveryDiv } from '../types/div.type';

export const getProducts = (
  slipDetails: TSlipDetailEntity[],
  deliveryDiv: DeliveryDiv,
  receivingDate: string,
): ProductDto[] => {
  return slipDetails.map(slipDetail => {
    return {
      gyoNo: slipDetail.gyoNo,
      productNm: slipDetail.productNm,
      size: slipDetail.size,
      quantityPerCase: slipDetail.quantityPerCase,
      numberOfCases:
        deliveryDiv === DeliveryDiv.COLLECTION
          ? slipDetail.tSlipDeadlines?.at(0)?.numberOfCases
          : slipDetail.numberOfCases,
      unitPerCase: slipDetail.unitPerCase,
      numberOfItems:
        deliveryDiv === DeliveryDiv.COLLECTION
          ? slipDetail.tSlipDeadlines?.at(0)?.numberOfItems
          : slipDetail.numberOfItems,
      unitPerItem: slipDetail.unitPerItem,
      totalNumber:
        deliveryDiv === DeliveryDiv.COLLECTION
          ? slipDetail.tSlipDeadlines?.at(0)?.totalNumber
          : slipDetail.totalNumber,
      remarks: slipDetail.remarks,
      deleteAt: slipDetail.deleteAt,
      deadline:
        deliveryDiv === DeliveryDiv.COLLECTION
          ? slipDetail.tSlipDeadlines?.at(0)?.deadline ?? null
          : receivingDate,
    };
  });
};
