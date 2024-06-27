import { EmailRecipients } from '@azure/communication-email';
import { HttpStatus } from '@nestjs/common';
import { TranslateOptions } from 'nestjs-i18n';

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum NodeEnvironment {
  DEV = 'dev',
  TEST = 'test',
  QA = 'qa',
  STAGING = 'stag',
  PROD = 'prod',
}

export enum AppConfig {
  COMMON_CONFIG = 'common-config',
  API_CONFIG = 'api-config',
  DATABASE_CONFIG = 'database-config',
  AUTH_CONFIG = 'auth-config',
  REDIS_CONFIG = 'redis-config',
  MAIL_CONFIG = 'mail-config',
  BATCH_CONFIG = 'batch-config',
  BLOB_STORAGE_CONFIG = 'blob-storage-config',
  GOOGLE_CONFIG = 'google-config',
  CRON_TIME_CONFIG = 'cron-time-config',
  IF_CONFIG = 'if-config',
}

export enum MailTemplate {
  CREATE_ACCOUNT = 'createAccount',
  EDIT_ACCOUNT = 'editAccount',
  FORGOT_PASSWORD = 'forgotPassword',
  INIT_PASSWORD = 'initPassword',
}

export enum AbilityAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface CustomError {
  code: string;
  message?: string;
  detail?: any;
  args?: TranslateOptions['args'];
}

export interface CustomErrorResponse {
  statusCode: HttpStatus;
  message: string;
  errors: CustomError[];
}

export enum ErrorCode {
  COM_COM001_001 = 'common.COM_COM001_001',
  COM_COM001_002 = 'common.COM_COM001_002',
  COM_COM001_003 = 'common.COM_COM001_003',

  COM_CER001_001 = 'auth.COM_CER001_001',
  COM_CER001_002 = 'auth.COM_CER001_002',
  COM_CER001_003 = 'auth.COM_CER001_003',
  COM_CER002_001 = 'auth.COM_CER002_001',

  MST_USR003_001 = 'user.MST_USR003_001',
  MST_USR002_001 = 'user.MST_USR002_001',
  MST_USR002_002 = 'user.MST_USR002_002',
  MST_USR002_003 = 'user.MST_USR002_003',
  MST_USR002_004 = 'user.MST_USR002_004',
  MST_USR002_005 = 'user.MST_USR002_005',
  MST_USR002_006 = 'user.MST_USR002_006',
  MST_USR002_007 = 'user.MST_USR002_007',
  MST_USR002_008 = 'user.MST_USR002_008',

  MST_TCM002_001 = 'transportCompany.MST_TCM002_001',
  MST_TCM002_002 = 'transportCompany.MST_TCM002_002',
  MST_TCM002_003 = 'transportCompany.MST_TCM002_003',
  MST_TCM002_004 = 'transportCompany.MST_TCM002_004',

  MST_DRV002_001 = 'driver.MST_DRV002_001',
  MST_DRV002_002 = 'driver.MST_DRV002_002',
  MST_DRV002_003 = 'driver.MST_DRV002_003',

  MST_CAR002_001 = 'car.MST_CAR002_001',
  MST_CAR002_002 = 'car.MST_CAR002_002',
  MST_CAR002_003 = 'car.MST_CAR002_003',

  IF_MST001_001 = 'if.IF_MST001_001',
  IF_REQ001_001 = 'if.IF_REQ001_001',

  TRN_CRS002_001 = 'course.TRN_CRS002_001',
  TRN_CRS004_001 = 'course.TRN_CRS004_001',
  TRN_CRS005_001 = 'course.TRN_CRS005_001',
  TRN_CRS010_001 = 'course.TRN_CRS010_001',
  TRN_CRS013_001 = 'course.TRN_CRS013_001',
  TRN_CRS014_001 = 'course.TRN_CRS014_001',
  TRN_CRS015_001 = 'course.TRN_CRS015_001',
  TRN_CRS016_001 = 'course.TRN_CRS016_001',
  TRN_DLV003_001 = 'course.TRN_DLV003_001',
  TRN_DLV003_002 = 'course.TRN_DLV003_002',
  TRN_CRS011_005 = 'course.TRN_CRS011_005',

  TRN_CRS009_001 = 'highwayFee.TRN_CRS009_001',
  TRN_CRS009_002 = 'highwayFee.TRN_CRS009_002',
  TRN_CRS009_003 = 'highwayFee.TRN_CRS009_003',
  TRN_CRS011_001 = 'highwayFee.TRN_CRS011_001',
  TRN_CRS011_002 = 'highwayFee.TRN_CRS011_002',

  TRN_REQ005_001 = 'base.TRN_REQ005_001',

  TRN_REQ007_001 = 'slip.TRN_REQ007_001',

  TRN_REQ006_001 = 'spot.TRN_REQ006_001',
  TRN_CRS006_001 = 'spot.TRN_CRS006_001',
  TRN_CRS007_001 = 'spot.TRN_CRS007_001',
  TRN_CRS007_002 = 'spot.TRN_CRS007_002',

  TRN_REQ002_001 = 'slip.TRN_REQ002_001',
  TRN_CRS011_003 = 'slip.TRN_CRS011_003',
  TRN_CRS011_004 = 'slip.TRN_CRS011_004',

  TRN_CRS018_001 = 'gpsAct.TRN_CRS018_001',
  TRN_CRS022_001 = 'gpsAct.TRN_CRS022_001',
  TRN_CRS022_002 = 'gpsAct.TRN_CRS022_002',
}

export interface ParameterSearchMappings {
  queryParam: string;
  field: string;
  operator: string;
  value?: string | number | string[] | number[];
  pattern?: string;
}

export enum MetadataKey {
  ROUTE_PUBLIC_KEY = 'route-public-key',
  ROLES_KEY = 'roles-key',
  SKIP_TRIM_KEY = 'skip-trim-key',
}

export interface AlphabetSpot {
  spotId: number;
  alphabet: string;
}

export enum AppService {
  API_SERVICE = 'api-service',
  BATCH_SERVICE = 'batch-service',
}

export const AppMessagePattern = {
  Batch: {
    IMPORT_BASE: 'batch.import_base',
    IMPORT_SLIP: 'batch.import_slip',
  },
} as const;

export const AppEventPattern = {
  Batch: {
    EXPORT_SIGN: 'batch.export_sign',
    CONFIRM_ACTUAL: 'batch.confirm_actual',
    ASSIGN_COURSE: 'batch.assign_course',
    AUTO_CREATE_COURSE: 'batch.auto_create_course',
    UPDATE_COURSE_DELIVERY_STATUS: 'batch.update_course_delivery_status',
    DELETE_PAST_GPS_ACT: 'batch.delete_past_gps_act',
    REMOVE_SESSION: 'batch.remove_session',
  },
} as const;

export enum LockKey {
  IMPORT_BASE = 'import-base',
  IMPORT_IF = 'import-if',
}

export const EventType = {
  Mail: {
    FORGOT_PASSWORD: 'mail.forgot_password',
    CREATE_ACCOUNT: 'mail.create_account',
    EDIT_ACCOUNT: 'mail.edit_account',
    INIT_PASSWORD: 'mail.init_password',
  },
};

export enum BatchMngId {
  IF_ESI001 = 'IF_ESI001',
  TRN_DLV004 = 'TRN_DLV004',
  TRN_DLV001 = 'TRN_DLV001',
  TRN_CRS001 = 'TRN_CRS001',
}

export interface SendMailProps {
  recipients: EmailRecipients;
  subject: string;
  template: MailTemplate;
  context?: Record<string, any>;
}
