import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class SlipDeadlineDto {
  @ApiProperty({ example: '2009-06-02' })
  @Expose()
  deadline: Date;

  @ApiProperty({ example: 3 })
  @Expose()
  totalNumber: number;

  @ApiProperty({ example: 55 })
  @Expose()
  numberOfCases: number;

  @ApiProperty({ example: 20 })
  @Expose()
  numberOfItems: number;

  @ApiProperty({ example: '2000-11-30T22:55:45.000Z' })
  @Expose()
  deleteAt: Date;
}

class SlipDetailDto {
  @ApiProperty({ example: 'product 1' })
  @Expose()
  productNm: string;

  @ApiProperty({ example: 'size' })
  @Expose()
  size: string;

  @ApiProperty({ example: 'remark' })
  @Expose()
  remarks: string;

  @ApiProperty({ example: '2000-11-30T22:55:45.000Z' })
  @Expose()
  deleteAt: Date;

  @ApiProperty({ example: 12 })
  @Expose()
  quantityPerCase: number;

  @ApiProperty({ example: 12 })
  @Expose()
  unitPerCase: number;

  @ApiProperty({ example: 12 })
  @Expose()
  unitPerItem: number;

  @ApiProperty({ example: 3 })
  @Expose()
  totalNumber: number;

  @ApiProperty({ example: 55 })
  @Expose()
  numberOfCases: number;

  @ApiProperty({ example: 20 })
  @Expose()
  numberOfItems: number;

  @ApiProperty({
    isArray: true,
    type: SlipDeadlineDto,
  })
  @Type(() => SlipDeadlineDto)
  @Expose()
  slipDeadlines: SlipDeadlineDto[];
}

class CargoImageDto {
  @ApiProperty({ example: 'https://image.com' })
  @Expose()
  url: string;
}

export class GetSlipResponseDto {
  @ApiProperty({ example: 'JU230029240' })
  @Expose()
  slipNo: string | null;

  @ApiProperty({ example: '01', nullable: true })
  @Expose()
  slipStatusDiv: SlipStatusDiv | null;

  @ApiProperty({ example: '未完了', nullable: true })
  @Expose()
  slipStatusDivNm: string | null;

  @ApiProperty({ example: '03', nullable: true })
  @Expose()
  deliveryDiv: DeliveryDiv | null;

  @ApiProperty({ example: '伝票差替', nullable: true })
  @Expose()
  deliveryDivNm: string | null;

  @ApiProperty({ example: 'returnMemo' })
  @Expose()
  returnMemo: string | null;

  @ApiProperty({ example: '1234' })
  @Expose()
  courseNo: string | null;

  @ApiProperty({ example: 'sale office' })
  @Expose()
  salesOffice: string | null;

  @ApiProperty({ example: 'sales representative ' })
  @Expose()
  salesRepresentativeNm: string | null;

  @ApiProperty({ example: 'input staff' })
  @Expose()
  inputStaff: string | null;

  @ApiProperty({ example: 'delivery company' })
  @Expose()
  deliveryCompany: string | null;

  @ApiProperty({ example: 'factory warehouse' })
  @Expose()
  factoryWarehouse: string | null;

  @ApiProperty({ example: 'remark' })
  @Expose()
  remarks: string | null;

  @ApiProperty({ example: 'order slip no' })
  @Expose()
  orderSlipNo: string | null;

  @ApiProperty({ example: true })
  @Expose()
  isExistOrderSlipNo: boolean;

  @ApiProperty({ example: '2023-04-13' })
  @Expose()
  shippingDate: Date | null;

  @ApiProperty({ example: 'shippingWarehouse' })
  @Expose()
  shippingWarehouse: string | null;

  @ApiProperty({ example: '2013-04-16' })
  @Expose()
  receivingDate: Date | null;

  @ApiProperty({ example: '01' })
  @Expose()
  customer: string | null;

  @ApiProperty({ example: 'site name' })
  @Expose()
  siteNm: string | null;

  @ApiProperty({ example: 'delivery destination' })
  @Expose()
  deliveryDestination: string | null;

  @ApiProperty({ example: 'delivery address' })
  @Expose()
  deliveryAddress: string | null;

  @ApiProperty({ example: '01' })
  @Expose()
  spotId: string | null;

  @ApiProperty({ example: true })
  @Expose()
  fixedFlg: string | null;

  @ApiProperty({ example: '120.12321341' })
  @Expose()
  latitude: string;

  @ApiProperty({ example: '30.12321341' })
  @Expose()
  longitude: string;

  @ApiProperty({ example: 'spot address' })
  @Expose()
  spotAddress?: string;

  @ApiProperty({ example: 'work memo' })
  @Expose()
  workMemo: string | null;

  @ApiProperty({ example: 3 })
  @Expose()
  baseId: number | null;

  @ApiProperty({ example: '+841234567' })
  @Expose()
  telNumber: string | null;

  @ApiProperty({ example: 'base memo' })
  @Expose()
  pointMemo: string | null;

  @ApiProperty({ example: 'https://image.com' })
  @Expose()
  electronicSignatureImage: string;

  @ApiProperty({ example: '2023-07-13' })
  @Expose()
  requestDate: string;

  @ApiProperty({ example: 'delivery memo' })
  @Expose()
  deliveryMemo: string;

  @ApiProperty({
    isArray: true,
    type: CargoImageDto,
  })
  @Type(() => CargoImageDto)
  @Expose()
  cargoImages: CargoImageDto[];

  @ApiProperty({
    isArray: true,
    type: SlipDetailDto,
  })
  @Type(() => SlipDetailDto)
  @Expose()
  slipDetails: SlipDetailDto[];

  @ApiProperty({ example: 'S110' })
  @Expose()
  purchaseOrderSlipNo: string | null;

  @ApiProperty({ example: true })
  @Expose()
  isExistPurchaseSlipNo: boolean;

  @ApiProperty({ example: 'procurement officer' })
  @Expose()
  procurementOfficer: string | null;

  @ApiProperty({ example: 'supplier' })
  @Expose()
  supplierCd: string | null;

  @ApiProperty({ example: 'address' })
  @Expose()
  address: string | null;

  @ApiProperty({ example: 'receivingWarehouse' })
  @Expose()
  receivingWarehouse: string | null;

  @ApiProperty({ example: 'sourceWarehouse' })
  @Expose()
  sourceWarehouse: string | null;

  @ApiProperty({ example: 'destinationWarehouse' })
  @Expose()
  destinationWarehouse: string | null;

  @ApiProperty({ example: 'pickupInfomation' })
  @Expose()
  pickupInformation: string | null;

  @ApiProperty({ example: ['2009-06-02'] })
  @Expose()
  deadline: string[];

  @ApiProperty({ example: '2000-11-30T22:55:45.000Z' })
  @Expose()
  deleteAt: Date;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}

export const mappingSlipDetail = (data: any) => {
  switch (data?.deliveryDiv) {
    case DeliveryDiv.ON_SITE_DELIVERY:
      return {
        slipNo: data.slipNo,
        seqNo: data.seqNo,
        slipStatusDiv: data.slipStatusDiv,
        slipStatusDivNm: data?.slipStatus?.divValueNm,
        deliveryDiv: data.deliveryDiv,
        deliveryDivNm: data?.deliveryStatus?.divValueNm,
        returnMemo: data.returnMemo,
        salesOffice: data.salesOffice,
        salesRepresentativeNm: data.salesRepresentativeNm,
        inputStaff: data.inputStaffNm,
        deliveryCompany: data.carrierNm,
        remarks: data.remarks,
        purchaseOrderSlipNo: data.tSlipHeaderForPurchaseOrder?.slipNo ?? null,
        shippingDate: data.shippingDate,
        receivingDate: data.receivingDate,
        customer: data.customerBase?.baseNm1 ?? null,
        shippingWarehouse: data.shippingWarehouseBase?.baseNm1 ?? null,
        factoryWarehouse: data.factoryWarehouseBase?.baseNm1 ?? null,
        siteNm: data.siteBase?.baseNm1 ?? null,
        deliveryDestination: data.deliveryDestinationBase?.baseNm1 ?? null,
        courseNo: getCourseName(data.tTrips),
        spotId: getSpotId(data.tTrips),
        fixedFlg: data.tTrips[0]?.tSpots[0]?.fixedFlg,
        latitude: data.tTrips[0]?.tSpots[0]?.latitude ?? null,
        longitude: data.tTrips[0]?.tSpots[0]?.longitude ?? null,
        spotAddress: getSpotAddress(data.tTrips),
        workMemo: getWorkMemo(data.tTrips),
        baseId: getBaseId(data.tTrips),
        pointMemo: getBaseMemo(data.tTrips),
        telNumber: getBaseTelNumber(data.tTrips),
        cargoImages: getCargoImages(data),
        slipDetails: getSlipDetail(data.tSlipDetails),
        deliveryAddress: getBaseAddress(data?.tTrips[0]?.arriveBase),
        deleteAt: data.deleteAt,
        deadline: getUniqueDeadline(data),
        electronicSignatureImage: data.electronicSignatureImage,
        requestDate: data.requestDate,
        deliveryMemo: data.deliveryMemo,
      };

    case DeliveryDiv.COLLECTION:
      return {
        slipNo: data.slipNo,
        seqNo: data.seqNo,
        slipStatusDiv: data.slipStatusDiv,
        slipStatusDivNm: data?.slipStatus?.divValueNm,
        deliveryDiv: data.deliveryDiv,
        deliveryDivNm: data?.deliveryStatus?.divValueNm,
        salesOffice: data.salesOffice,
        salesRepresentativeNm: data.salesRepresentativeNm,
        deliveryCompany: data.carrierNm,
        remarks: data.remarks,
        orderSlipNo: data.slipNoForPurchaseOrder,
        procurementOfficer: data.procurementOfficerNm,
        pickupInformation: data.pickupInformation,
        supplierCd: data.supplierBase?.baseNm1 ?? null,
        receivingWarehouse: data.receivingWarehouseBase?.baseNm1 ?? null,
        courseNo: getCourseName(data.tTrips),
        spotId: getSpotId(data.tTrips),
        fixedFlg: data.tTrips[0]?.tSpots[0]?.fixedFlg,
        latitude: data.tTrips[0]?.tSpots[0]?.latitude ?? null,
        longitude: data.tTrips[0]?.tSpots[0]?.longitude ?? null,
        spotAddress: getSpotAddress(data.tTrips),
        workMemo: getWorkMemo(data.tTrips),
        baseId: getBaseId(data.tTrips),
        pointMemo: getBaseMemo(data.tTrips),
        telNumber: getBaseTelNumber(data.tTrips),
        cargoImages: getCargoImages(data),
        slipDetails: getSlipDetail(data.tSlipDetails),
        address: getBaseAddress(data?.tTrips[0]?.startBase),
        deleteAt: data.deleteAt,
        deadline: getUniqueDeadline(data),
      };

    case DeliveryDiv.INVENTORY_MOVEMENT:
      return {
        slipNo: data.slipNo,
        seqNo: data.seqNo,
        slipStatusDiv: data.slipStatusDiv,
        slipStatusDivNm: data?.slipStatus?.divValueNm,
        deliveryDiv: data.deliveryDiv,
        deliveryDivNm: data?.deliveryStatus?.divValueNm,
        salesOffice: data.salesOffice,
        salesRepresentativeNm: data.transferStaffNm,
        sourceWarehouse: data.sourceWarehouseBase?.baseNm1 ?? null,
        destinationWarehouse: data.destinationWarehouseBase?.baseNm1 ?? null,
        deliveryCompany: data.carrierNm,
        shippingDate: data.shippingDate,
        receivingDate: data.receivingDate,
        remarks: data.remarks,
        courseNo: getCourseName(data.tTrips),
        spotId: getSpotId(data.tTrips),
        fixedFlg: data.tTrips[0]?.tSpots[0]?.fixedFlg,
        latitude: data.tTrips[0]?.tSpots[0]?.latitude ?? null,
        longitude: data.tTrips[0]?.tSpots[0]?.longitude ?? null,
        spotAddress: getSpotAddress(data.tTrips),
        workMemo: getWorkMemo(data.tTrips),
        baseId: getBaseId(data.tTrips),
        pointMemo: getBaseMemo(data.tTrips),
        telNumber: getBaseTelNumber(data.tTrips),
        cargoImages: getCargoImages(data),
        slipDetails: getSlipDetail(data.tSlipDetails),
        deleteAt: data.deleteAt,
        deadline: getUniqueDeadline(data),
      };

    default:
      return {};
  }
};

const getCourseName = (trips: any[]) => {
  const result = trips.find(trip => trip?.tCourse?.course);
  return result?.tCourse?.course?.courseNm || null;
};

const getSpotId = (trips: any[]) => {
  const trip = trips.find(trip => trip?.tSpots.length > 0);
  if (!trip || trip?.tSpots.length === 0) return null;
  return trip.tSpots[0].spotId;
};

const getSpotAddress = (trips: any[]) => {
  const spot = trips[0]?.tSpots[0];
  return !spot
    ? null
    : `${spot?.address1 || ''}${spot?.address2 || ''}${spot?.address3 || ''}`;
};

const getWorkMemo = (trips: any[]) => {
  const trip = trips.find(trip => trip?.tSpots.length > 0);
  if (!trip || trip?.tSpots.length === 0) return null;
  return trip.tSpots[0].workMemo;
};

const getBaseId = (trips: any[]) => {
  const result = trips.find(trip => trip?.arriveBase);
  return result?.arriveBase?.baseId || null;
};

const getBaseMemo = (trips: any[]) => {
  const result = trips.find(trip => trip?.arriveBase);
  return result?.arriveBase?.baseMemo || null;
};

const getBaseTelNumber = (trips: any[]) => {
  const result = trips.find(trip => trip?.arriveBase);
  return result?.arriveBase?.telNumber || null;
};

const getSlipDetail = (slipDetails: any[]): SlipDetailDto[] => {
  return slipDetails.map(slipDetail => {
    return {
      productNm: slipDetail.productNm,
      size: slipDetail.size,
      remarks: slipDetail.remarks,
      totalNumber: slipDetail.totalNumber,
      numberOfCases: slipDetail.numberOfCases,
      numberOfItems: slipDetail.numberOfItems,
      deleteAt: slipDetail.deleteAt,
      quantityPerCase: slipDetail.quantityPerCase,
      unitPerCase: slipDetail.unitPerCase,
      unitPerItem: slipDetail.unitPerItem,
      slipDeadlines: getSlipDeadline(slipDetail.tSlipDeadlines),
    };
  });
};

const getSlipDeadline = (slipDeadlines: any[]): SlipDeadlineDto[] => {
  return slipDeadlines.map(slipDeadline => {
    return {
      totalNumber: slipDeadline.totalNumber,
      numberOfCases: slipDeadline.numberOfCases,
      numberOfItems: slipDeadline.numberOfItems,
      deadline: slipDeadline.deadline,
      deleteAt: slipDeadline.deleteAt,
    };
  });
};

const getCargoImages = (data: any): CargoImageDto[] => {
  const result: CargoImageDto[] = [
    { url: data.image1 ?? null },
    { url: data.image2 ?? null },
    { url: data.image3 ?? null },
    { url: data.image4 ?? null },
    { url: data.image5 ?? null },
  ];
  return result;
};

const getBaseAddress = (base: any) => {
  if (!base) return null;
  return (base.address1 || '') + (base.address2 || '') + (base.address3 || '');
};

const getUniqueDeadline = (data: TSlipHeaderEntity): string[] => {
  const deadlines: string[] = [];

  data.tSlipDetails.forEach(slipDetail => {
    slipDetail.tSlipDeadlines.forEach(slipDeadline => {
      if (slipDeadline.deadline) {
        deadlines.push(slipDeadline.deadline.toString());
      }
    });
  });

  return [...new Set(deadlines)];
};
