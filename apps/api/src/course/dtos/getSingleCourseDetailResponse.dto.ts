import { ImageDto } from '@app/common/dtos/imageResponse.dto';
import {
  getDeliveryStatusDivNm,
  getPaymentMethodDivNm,
  getStatusDivNm,
  getWorkKindDivNm,
} from '@app/common/utils/getDivValueNm.util';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeReceiptImageEntity } from '@app/database/entities/tHighwayFeeReceiptImage.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import moment from 'moment';

class SpotDto {
  @ApiProperty({ example: 1 })
  @Expose()
  spotId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  order: number;

  @ApiProperty({ example: 'Tokyo' })
  @Expose()
  address: string;

  @ApiProperty({ example: '123.64300000000000' })
  @Expose()
  latitude: string;

  @ApiProperty({ example: '123.64300000000000' })
  @Expose()
  longitude: string;

  @ApiProperty({ example: '仕入先名称' })
  @Expose()
  baseNm: string;

  @ApiProperty({ example: 1 })
  @Expose()
  slipNo: string;
  
  @ApiProperty({ example: 1 })
  @Expose()
  seqNo: number;

  @ApiProperty({ example: '荷卸し' })
  @Expose()
  workContent: string;

  @ApiProperty({ example: '02' })
  @Expose()
  deliveryStatusDiv: string;

  @ApiProperty({ example: '未完了' })
  @Expose()
  deliveryStatusDivNm: string;

  @ApiProperty({ example: true })
  @Expose()
  fixedFlg: boolean;

  @ApiProperty({ example: '2023-08-23' })
  @Expose()
  requestDate: string;

  @ApiProperty({ example: 'delivery memo' })
  @Expose()
  deliveryMemo: string;

  @ApiProperty({ example: '10:21:20' })
  @Expose()
  updateTime: string;

  @ApiProperty({ example: 'ZTYzeKXNZO' })
  @Expose()
  remarks: string;

  @ApiProperty({ example: 'assignMemo' })
  @Expose()
  assignMemo: string;

  @ApiProperty({ example: '仕入先名称' })
  @Expose()
  receivingWarehouse: string;

  @ApiProperty({ example: 1 })
  @Expose()
  purchaseSlipNo: string;

  @ApiProperty({ example: 1 })
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
}

class ReceiptImageDto extends ImageDto {
  @ApiProperty({ example: 1 })
  @Expose()
  imageNo: number;

  @ApiProperty({
    example:
      'https://znews-photo.zingcdn.me/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
  })
  @Expose()
  receiptImage: string;
}

class HighwayFeeDto {
  @ApiProperty({ example: 2 })
  @Expose()
  highwayFeeNo: number;

  @ApiProperty({ example: 100 })
  @Expose()
  highwayAmount: number;

  @ApiProperty({ example: '02' })
  @Expose()
  paymentMethodDiv: string;

  @ApiProperty({ example: '会社払い（現金）' })
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

export class GetSingleCourseResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  courseSeqNo: string | null;

  @ApiProperty({ example: 1 })
  @Expose()
  courseId: number;

  @ApiProperty({ example: '2023-07-04' })
  @Expose()
  serviceYmd: string;

  @ApiProperty({ example: '11:28:49' })
  @Expose()
  startTime: Date;

  @ApiProperty({ example: '11:28:49' })
  @Expose()
  endTime: string;

  @ApiProperty({ example: 1 })
  @Expose()
  startBaseId: number;

  @ApiProperty({ example: '仕入先名称' })
  @Expose()
  startBase: string;

  @ApiProperty({ example: 1 })
  @Expose()
  arriveBaseId: number;

  @ApiProperty({ example: '仕入先名称' })
  @Expose()
  arriveBase: string;

  @ApiProperty({ example: false })
  @Expose()
  signboardPhotoFlg: boolean;

  @ApiProperty({ example: 'oJFXs9noDD' })
  @Expose()
  courseNo: string;

  @ApiProperty({ example: 'tcom2' })
  @Expose()
  deliveryCompany: string;

  @ApiProperty({ example: 'car1' })
  @Expose()
  carManagementNum: string;

  @ApiProperty({ example: 'driver 5' })
  @Expose()
  driver: string;

  @ApiProperty({ example: '0567845014' })
  @Expose()
  telNumber: string;

  @ApiProperty({ example: '01' })
  @Expose()
  deliveryStatus: string;

  @ApiProperty({ example: '未完了' })
  @Expose()
  deliveryStatusNm: string;

  @ApiProperty({ example: '17:22:19-12:15:49' })
  @Expose()
  workTime: string;

  @ApiProperty({ example: '17:22:19' })
  @Expose()
  actualStartTime: string;

  @ApiProperty({ example: '17:22:19' })
  @Expose()
  actualEndTime: string;

  @ApiProperty({ example: 912 })
  @Expose()
  transitDistance: string;

  @ApiProperty({ example: '123.64300000000000' })
  @Expose()
  startLatitude: string;

  @ApiProperty({ example: '123.64300000000000' })
  @Expose()
  arriveLatitude: string;

  @ApiProperty({ example: '123.64300000000000' })
  @Expose()
  startLongitude: string;

  @ApiProperty({ example: '123.64300000000000' })
  @Expose()
  arriveLongitude: string;

  @ApiProperty({ example: 1000 })
  @Expose()
  totalHighwayFee: number;

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

export const mappingSingleCourseDetail = (
  course: TCourseEntity,
  spotRecords: TSpotEntity[],
) => {
  const result = {
    courseSeqNo: course.courseSeqNo,
    serviceYmd: course.serviceYmd,
    courseId: course.courseId,
    startTime: course.startTime,
    endTime: course.endTime,
    startBase: course.startBase?.baseNm1,
    arriveBase: course.arriveBase?.baseNm1,
    deliveryCompany: course.transportCompany?.transportCompanyNm,
    carManagementNum: course.car?.carManagementNum,
    driver: course.driver?.driverNm,
    telNumber: course.driver?.telNumber,
    deliveryStatus: course.deliveryStatusDiv,
    deliveryStatusNm: course.deliveryStatusDiv
      ? getDeliveryStatusDivNm(course.deliveryStatusDiv)
      : null,
    workTime: calculateDurationTimes(
      course.actualStartTime ?? '',
      course.actualEndTime ?? '',
    ),
    actualStartTime: course.actualStartTime,
    actualEndTime: course.actualEndTime,
    transitDistance: course.transitDistance,
    courseNo: course.course?.courseNm,
    signboardPhotoFlg: getSignboardPhotoFlg(course),
    startLatitude: course.startBase?.latitude,
    arriveLatitude: course.arriveBase?.latitude,
    startLongitude: course.startBase?.longitude,
    arriveLongitude: course.arriveBase?.longitude,
    totalHighwayFee: getTotalHighwayFee(course.tHighwayFees),
    spots: getSpots(spotRecords),
    highwayFees: getHighwayFees(course.tHighwayFees),
  };

  return result;
};

//---------function handle Course ---------------

const getSignboardPhotoFlg = (data: any) =>
  Object.keys(data).some(key => key.startsWith('signboardPhoto') && !data[key]);

const getTotalHighwayFee = (data: any[]) => {
  return data.reduce((sum, current) => {
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
      order: item.order,
      address: getAddress(item.address1, item.address2, item.address3),
      latitude: item.latitude,
      longitude: item.longitude,
      fixedFlg: item.fixedFlg,
      requestDate: item?.trip?.tSlipHeader?.requestDate,
      deliveryMemo: item?.trip?.tSlipHeader?.deliveryMemo,
      baseNm: item.baseNm,
      slipNo: item?.trip?.slipNo,
      seqNo: item?.trip?.tSlipHeader?.seqNo,
      workContent: getWorkKindDivNm(item.workKindsDiv),
      deliveryStatusDiv: item.statusDiv,
      deliveryStatusDivNm: getStatusDivNm(item.statusDiv),
      updateTime: item.workEndTime,
      remarks: item?.trip?.tSlipHeader?.remarks,
      assignMemo: item?.trip?.tSlipHeader?.assignMemo,
      receivingWarehouse:
        item?.trip?.tSlipHeader?.receivingWarehouseBase?.baseNm1 ?? null,
      purchaseSlipNo: item?.trip?.tSlipHeader?.slipNoForPurchaseOrder,
      orderSlipNo: item?.trip?.tSlipHeader?.slipForPurchaseOrder?.slipNo,
      telNumber: item.telNumber,
      pointMemo: item?.base?.baseMemo ?? null,
      workMemo: item.workMemo,
      images: [
        {
          url: item?.trip?.tSlipHeader?.image1 ?? null,
        },
        {
          url: item?.trip?.tSlipHeader?.image2 ?? null,
        },
        {
          url: item?.trip?.tSlipHeader?.image3 ?? null,
        },
        {
          url: item?.trip?.tSlipHeader?.image4 ?? null,
        },
        {
          url: item?.trip?.tSlipHeader?.image5 ?? null,
        },
      ],
    };
  });
};

const getAddress = (
  address1: string | null,
  address2: string | null,
  address3: string | null,
) => {
  return (address1 ?? '') + (address2 ?? '') + (address3 ?? '');
};

//---------function handle HighwayFee ---------------

const getHighwayFees = (data: any[]) => {
  return data.map(item => {
    return {
      highwayFeeNo: item.highwayFeeNo,
      highwayAmount: item.amount,
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
      receiptImage: item.receiptImage,
    };
  });
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
