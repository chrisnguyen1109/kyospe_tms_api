import { ProductDto } from '@app/common/dtos/commonSpotResponse.dto';
import { ImageDto } from '@app/common/dtos/imageResponse.dto';
import { getAddress } from '@app/common/utils/getAddress';
import {
  getDeliveryDivNm,
  getDeliveryStatusDivNm,
  getPaymentMethodDivNm,
  getStatusDivNm,
  getWorkKindDivNm,
} from '@app/common/utils/getDivValueNm.util';
import { getProducts } from '@app/common/utils/getProduct.util';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
import { THighwayFeeReceiptImageEntity } from '@app/database/entities/tHighwayFeeReceiptImage.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import moment from 'moment';

class SpotDto {
  @ApiProperty({ example: 'JU230029240' })
  @Expose()
  courseSeqNo: string | null;

  @ApiProperty({ example: 1 })
  @Expose()
  spotId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  no: number;

  @ApiProperty({ example: 'Tokyo' })
  @Expose()
  address: string;

  @ApiProperty({ example: 'latitude' })
  @Expose()
  latitude: string;

  @ApiProperty({ example: 'longitude' })
  @Expose()
  longitude: string;

  @ApiProperty({ example: 1 })
  @Expose()
  baseId: string;

  @ApiProperty({ example: 'baseNm' })
  @Expose()
  baseNm: string;

  @ApiProperty({ example: 'slipNo1' })
  @Expose()
  slipNo: string;

  @ApiProperty({ example: 1 })
  @Expose()
  seqNo: number;

  @ApiProperty({ example: 'workContent' })
  @Expose()
  workContent: string;

  @ApiProperty({ example: '01' })
  @Expose()
  deliveryDiv: string;

  @ApiProperty({ example: 'deliveryDivNm' })
  @Expose()
  deliveryDivNm: string;

  @ApiProperty({ example: '02' })
  @Expose()
  deliveryStatusDiv: string;

  @ApiProperty({ example: 'deliveryStatusDivNm' })
  @Expose()
  deliveryStatusDivNm: string;

  @ApiProperty({ example: 'JU230029240' })
  @Expose()
  updateTime: string;

  @ApiProperty({ example: 'remarks' })
  @Expose()
  remarks: string;

  @ApiProperty({ example: 'asignMemo' })
  @Expose()
  asignMemo: string;

  @ApiProperty({ example: 'receivingWarehouse' })
  @Expose()
  receivingWarehouse: string;

  @ApiProperty({ example: 'purchaseSlipNo' })
  @Expose()
  purchaseSlipNo: string;

  @ApiProperty({ example: 'orderSlipNo' })
  @Expose()
  orderSlipNo: string;

  @ApiProperty({ example: '0789123654' })
  @Expose()
  telNumber: string;

  @ApiProperty({ example: 'pointMemo' })
  @Expose()
  pointMemo: string;

  @ApiProperty({ example: 'workMemo' })
  @Expose()
  workMemo: string;

  @ApiProperty({
    isArray: true,
    type: ImageDto,
  })
  @Type(() => ImageDto)
  @Expose()
  images: ImageDto[];

  @ApiProperty({ example: 'https://image.com' })
  @Expose()
  electronicSignatureImage: string;

  @ApiProperty({ example: '16:00 - 18:00' })
  @Expose()
  requestDate: string;

  @ApiProperty({ example: 'delivery memo' })
  @Expose()
  deliveryMemo: string;

  @ApiProperty({ example: true })
  @Expose()
  fixedFlg: boolean;

  @ApiProperty({
    isArray: true,
    type: ProductDto,
  })
  @Type(() => ProductDto)
  @Expose()
  products: ProductDto[];
}

class ReceiptImageDto extends ImageDto {
  @ApiProperty({ example: 1 })
  @Expose()
  imageNo: number;

  @ApiProperty({ example: 2 })
  @Expose()
  highwayFeeNo: number;
}

class HighwayFeeDto {
  @ApiProperty({ example: 'courseSeqNo' })
  @Expose()
  courseSeqNo: string;

  @ApiProperty({ example: 2 })
  @Expose()
  highwayFeeNo: number;

  @ApiProperty({ example: 100 })
  @Expose()
  amount: number;

  @ApiProperty({ example: '02' })
  @Expose()
  paymentMethodDiv: string;

  @ApiProperty({ example: 'paymentMethod' })
  @Expose()
  paymentMethodDivNm: string;

  @ApiProperty({
    isArray: true,
    type: ReceiptImageDto,
  })
  @Type(() => ReceiptImageDto)
  @Expose()
  receiptImages: ReceiptImageDto[];
}

export class GetCourseResponseDto {
  @ApiProperty({ example: '2023-07-04' })
  @Expose()
  serviceYmd: string;

  @ApiProperty({ example: 1 })
  @Expose()
  courseId: number;

  @ApiProperty({ example: '2018-12-22' })
  @Expose()
  startTime: Date;

  @ApiProperty({ example: '2018-12-22' })
  @Expose()
  endTime: string;

  @ApiProperty({ example: 1 })
  @Expose()
  startBaseId: number;

  @ApiProperty({ example: 'startBase' })
  @Expose()
  startBase: string;

  @ApiProperty({ example: 1 })
  @Expose()
  arriveBaseId: number;

  @ApiProperty({ example: 'arriveBase' })
  @Expose()
  arriveBase: string;

  @ApiProperty({ example: false })
  @Expose()
  signboardPhotoFlg: boolean;

  @ApiProperty({ example: true })
  @Expose()
  charterFlg: boolean;

  @ApiProperty({ example: 'courseNo' })
  @Expose()
  courseNo: string;

  @ApiProperty({ example: 'deliveryCompany' })
  @Expose()
  deliveryCompany: string;

  @ApiProperty({ example: 'carManagementNum' })
  @Expose()
  carManagementNum: string;

  @ApiProperty({ example: 'driverNm' })
  @Expose()
  driverNm: string;

  @ApiProperty({ example: '0567845014' })
  @Expose()
  telNumber: string;

  @ApiProperty({ example: '01' })
  @Expose()
  deliveryStatusDiv: string;

  @ApiProperty({ example: 'deliveryStatusDivNm' })
  @Expose()
  deliveryStatusDivNm: string;

  @ApiProperty({ example: '01' })
  @Expose()
  deliveryDivCourseMax: string;

  @ApiProperty({ example: '2018-12-22' })
  @Expose()
  workTime: string;

  @ApiProperty({ example: '2016-02-03' })
  @Expose()
  actualStartTime: string;

  @ApiProperty({ example: '2018-12-22' })
  @Expose()
  actualEndTime: string;

  @ApiProperty({ example: 'transitDistance' })
  @Expose()
  transitDistance: string;

  @ApiProperty({ example: 'courseSeqNo' })
  @Expose()
  courseSeqNo: string;

  @ApiProperty({ example: 1000 })
  @Expose()
  totalHighwayFee: number;

  @ApiProperty({ example: 'memo' })
  @Expose()
  memo: string;

  @ApiProperty({
    isArray: true,
    type: ImageDto,
  })
  @Type(() => ImageDto)
  @Expose()
  signboardPhotos: ImageDto[];

  @ApiProperty({
    isArray: true,
    type: SpotDto,
  })
  @Type(() => SpotDto)
  @Expose()
  spots: SpotDto[];

  @ApiProperty({
    isArray: true,
    type: HighwayFeeDto,
  })
  @Type(() => HighwayFeeDto)
  @Expose()
  highwayFees: HighwayFeeDto[];

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}

export const mappingCourseDetail = (
  courseRecords: TCourseEntity[],
  highwayFeesRecords: THighwayFeeEntity[],
  spotRecords: TSpotEntity[],
) => {
  if (courseRecords.length === 0) return {};

  const deliveryStatus = getDeliveryStatus(courseRecords);
  const result = {
    serviceYmd: courseRecords[0]?.serviceYmd,
    courseId: courseRecords[0]?.courseId,
    startTime: courseRecords[0]?.startTime,
    endTime: courseRecords[0]?.endTime,
    startBaseId: courseRecords[0]?.startBaseId,
    startBase: courseRecords[0]?.startBase?.baseNm1,
    arriveBaseId: courseRecords[0]?.arriveBaseId,
    arriveBase: courseRecords[0]?.arriveBase?.baseNm1,
    signboardPhotoFlg: getSignboardPhotoFlg(courseRecords),
    charterFlg: courseRecords[0]?.course?.charterFlg,
    courseNo: courseRecords[0]?.course?.courseNm,
    deliveryCompany: getDeliveryCompany(courseRecords),
    carManagementNum: getCarManagementNum(courseRecords),
    driverNm: getDriverNm(courseRecords),
    telNumber: getTelNumber(courseRecords),
    deliveryStatusDiv: deliveryStatus.deliveryStatusDiv,
    deliveryStatusDivNm: deliveryStatus.deliveryStatusDivNm,
    deliveryDivCourseMax: getDeliveryDivCourseMax(courseRecords),
    workTime: getWorkTime(courseRecords),
    actualStartTime: getActualStartTime(courseRecords),
    actualEndTime: getActualEndTime(courseRecords),
    transitDistance: getTransitDistance(courseRecords),
    courseSeqNo: getCourseSeqNo(courseRecords),
    totalHighwayFee: getTotalHighwayFee(courseRecords),
    signboardPhotos: getSignboardPhotos(courseRecords),
    spots: getSpots(spotRecords),
    highwayFees: getHighwayFees(highwayFeesRecords),
    memo: courseRecords[0]?.memo,
  };

  return result;
};

//---------function handle Course ---------------

const getDeliveryCompany = (data: any[]) => {
  const companies = data.map(item => item.transportCompany);
  const maxTransportCompany = companies.reduce((maxCompany, currentCompany) => {
    if (currentCompany?.transportCompanyNm) {
      return !maxCompany ||
        currentCompany.transportCompanyNm > maxCompany.transportCompanyNm
        ? currentCompany
        : maxCompany;
    }
    return maxCompany;
  }, null);
  if (!maxTransportCompany) return null;
  return maxTransportCompany.transportCompanyNm;
};

const getCarManagementNum = (data: any[]) => {
  const cars = data.map(item => item.car);
  const maxCar = cars.reduce((maxCar, currentCar) => {
    if (currentCar?.carManagementNum) {
      return !maxCar || currentCar.carManagementNum > maxCar.carManagementNum
        ? currentCar
        : maxCar;
    }
    return maxCar;
  }, null);
  if (!maxCar) return null;
  return maxCar.carManagementNum;
};

const getDriverNm = (data: any[]) => {
  const drivers = data.map(item => item.driver);
  const maxDriver = drivers.reduce((maxDriver, currentDriver) => {
    if (currentDriver?.driverNm) {
      return !maxDriver || currentDriver.driverNm > maxDriver.driverNm
        ? currentDriver
        : maxDriver;
    }
    return maxDriver;
  }, null);
  if (!maxDriver) return null;
  return maxDriver.driverNm;
};

const getTelNumber = (data: any[]) => {
  const drivers = data.map(item => item.driver);
  const maxDriver = drivers.reduce((maxDriver, currentDriver) => {
    if (currentDriver?.telNumber) {
      return !maxDriver || currentDriver.telNumber > maxDriver.telNumber
        ? currentDriver
        : maxDriver;
    }
    return maxDriver;
  }, null);
  if (!maxDriver) return null;
  return maxDriver.telNumber;
};

const getDeliveryStatus = (data: any[]) => {
  const minDeliveryStatusDiv = data.reduce((min, current) => {
    return current.deliveryStatusDiv < min.deliveryStatusDiv ? current : min;
  });
  return {
    deliveryStatusDiv: minDeliveryStatusDiv.deliveryStatusDiv,
    deliveryStatusDivNm: getDeliveryStatusDivNm(
      minDeliveryStatusDiv.deliveryStatusDiv,
    ),
  };
};

const getWorkTime = (data: any[]) => {
  const listDuration = data.map(item => {
    return calculateDurationTimes(item.actualStartTime, item.actualEndTime);
  });
  return calculateSumTimes(listDuration);
};

const getActualStartTime = (data: any[]) => {
  const DATE_DEFAULT = '1970-01-01T';

  const maxStartTime = data.reduce((max, current) => {
    const currentStartTime = new Date(
      `${DATE_DEFAULT}${current.actualStartTime}`,
    );
    const maxStartTime = new Date(`${DATE_DEFAULT}${max.actualStartTime}`);
    return currentStartTime < maxStartTime ? current : max;
  });

  return maxStartTime.actualStartTime ?? null;
};

const getActualEndTime = (data: any[]) => {
  const DATE_DEFAULT = '1970-01-01T';

  const minEndTime = data.reduce((min, current) => {
    const currentEndTime = new Date(`${DATE_DEFAULT}${current.actualEndTime}`);
    const minEndTime = new Date(`${DATE_DEFAULT}${min.actualEndTime}`);
    return currentEndTime > minEndTime ? current : min;
  });

  return minEndTime.actualEndTime ?? null;
};

const getTransitDistance = (data: any[]) => {
  return data.reduce((sum, current) => {
    if (current.transitDistance) {
      return sum + current.transitDistance;
    }
    return sum;
  }, 0);
};

const getCourseSeqNo = (data: any[]) => {
  return data.reduce((max, current) => {
    if (current.courseSeqNo !== null && current.courseSeqNo > max) {
      return current.courseSeqNo;
    }
    return max;
  }, -Infinity);
};

const getSignboardPhotos = (data: any[]) => {
  return data.flatMap(obj =>
    Object.keys(obj)
      .filter(key => obj[key] !== null && key.startsWith('signboardPhoto'))
      .map(key => ({ url: obj[key] })),
  );
};

const getDeliveryDivCourseMax = (listCourse: TCourseEntity[]) =>
  listCourse.sort((a, b) => b.courseSeqNo - a.courseSeqNo)[0]
    ?.deliveryStatusDiv;

const getSignboardPhotoFlg = (data: any[]) => {
  return data.some(obj =>
    Object.keys(obj).some(
      key => key.startsWith('signboardPhoto') && obj[key] !== null,
    ),
  );
};

const getTotalHighwayFee = (data: any[]) => {
  return data
    .flatMap(obj => obj.tHighwayFees)
    .reduce((sum, current) => {
      if (current.amount) {
        return sum + parseFloat(current.amount);
      }
      return sum;
    }, 0);
};

//---------function handle Spot ---------------

const getSpots = (data: any[]) => {
  return data.map(item => {
    return {
      courseSeqNo: item?.trip?.courseSeqNo,
      spotId: item.spotId,
      no: item.order ?? null,
      address: getAddress(item.address1, item.address2, item.address3),
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      baseId: item.baseId ?? null,
      baseNm: item.baseNm ?? null,
      slipNo: item?.trip?.slipNo,
      seqNo: item?.trip?.tSlipHeader?.seqNo,
      workContent: getWorkKindDivNm(item.workKindsDiv),
      deliveryDiv: item?.trip?.tSlipHeader?.deliveryDiv,
      deliveryDivNm: getDeliveryDivNm(item?.trip?.tSlipHeader?.deliveryDiv),
      deliveryStatusDiv: item.statusDiv,
      deliveryStatusDivNm: getStatusDivNm(item.statusDiv),
      updateTime: item.workEndTime,
      remarks: item?.trip?.tSlipHeader?.remarks ?? null,
      asignMemo: item?.trip?.tSlipHeader?.assignMemo ?? null,
      receivingWarehouse:
        item?.trip?.tSlipHeader?.receivingWarehouseBase?.baseNm1 ?? null,
      orderSlipNo: item?.trip?.tSlipHeader?.slipNoForPurchaseOrder ?? null,
      purchaseSlipNo:
        item?.trip?.tSlipHeader?.tSlipHeaderForPurchaseOrder?.slipNo ?? null,
      telNumber: item.telNumber ?? null,
      pointMemo: item?.base?.baseMemo ?? null,
      workMemo: item.workMemo ?? null,
      images: getImages(item?.trip?.tSlipHeader),
      electronicSignatureImage:
        item?.trip?.tSlipHeader?.electronicSignatureImage ?? null,
      requestDate: item?.trip?.tSlipHeader?.requestDate ?? null,
      deliveryMemo: item?.trip?.tSlipHeader?.deliveryMemo ?? null,
      fixedFlg: item.fixedFlg,
      products: getProducts(
        item?.trip?.tSlipHeader?.tSlipDetails || [],
        item?.trip?.tSlipHeader?.deliveryDiv,
        item?.trip?.tSlipHeader?.receivingDate,
      ),
    };
  });
};

const getImages = (slipHeader: TSlipHeaderEntity) => {
  const images = [
    {
      url: slipHeader?.image1 ?? null,
    },
    {
      url: slipHeader?.image2 ?? null,
    },
    {
      url: slipHeader?.image3 ?? null,
    },
    {
      url: slipHeader?.image4 ?? null,
    },
    {
      url: slipHeader?.image5 ?? null,
    },
  ];

  return images;
};

//---------function handle HighwayFee ---------------

const getHighwayFees = (data: any[]) => {
  return data.map(item => {
    return {
      courseSeqNo: item.courseSeqNo,
      highwayFeeNo: item.highwayFeeNo,
      amount: item.amount,
      paymentMethodDiv: item.paymentMethodDiv,
      paymentMethodDivNm: getPaymentMethodDivNm(item.paymentMethodDiv),
      receiptImages: getReceiptImages(item.tHighwayFeeReceiptImages),
    };
  });
};

const getReceiptImages = (data: THighwayFeeReceiptImageEntity[]) => {
  return data.map(item => {
    return {
      imageNo: item.imageNo,
      highwayFeeNo: item.highwayFeeNo,
      url: item.receiptImage,
    };
  });
};

//---------function calculate time ---------------

const timeToMilliseconds = (time: string) => {
  const parts = time.split(':');
  const hours = parts[0] ? parseInt(parts[0]) : 0;
  const minutes = parts[1] ? parseInt(parts[1]) : 0;
  const seconds = parts[2] ? parseInt(parts[2]) : 0;
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

const millisecondsToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours + ':' + minutes + ':' + seconds;
};

const calculateSumTimes = (times: string[]): string => {
  const totalMilliseconds = times.reduce(
    (total, time) => total + timeToMilliseconds(time),
    0,
  );
  return millisecondsToTime(totalMilliseconds);
};

const calculateDurationTimes = (startTime: string, endTime: string) => {
  const DATE_DEFAULT = '2000-01-01 ';
  const startDate = moment(DATE_DEFAULT + startTime, 'YYYY-MM-DD HH:mm:ss');
  const endDate = moment(DATE_DEFAULT + endTime, 'YYYY-MM-DD HH:mm:ss');

  const duration = moment.duration(endDate.diff(startDate));

  const formattedTime = moment
    .utc(duration.asMilliseconds())
    .format('HH:mm:ss');

  return formattedTime;
};
