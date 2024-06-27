import { AppConfigService } from '@app/app-config/appConfig.service';
import { AsyncLockService } from '@app/common/services/asyncLock.service';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import { BatchMngId, LockKey } from '@app/common/types/common.type';
import { ClassConstructor, ValueOf } from '@app/common/types/util.type';
import { handleClassValidatorErr } from '@app/common/utils/handleClassValidatorErr.util';
import { omitUndefined } from '@app/common/utils/omitUndefined.util';
import {
  ifMBaseFilePattern,
  ifSLipFilePattern,
} from '@app/common/utils/regexPattern.util';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { TBatchMngRepository } from '@app/database/repositories/tBatchMng.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { ImportMBaseTransaction } from '@app/database/transactions/importMBase.transaction';
import { ImportSlipTransaction } from '@app/database/transactions/importSlip.transaction';
import { I18nTranslations } from '@app/i18n/i18n.type';
import { DeliveryService } from '@batch/delivery/delivery.service';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { parse, stringify, transform } from 'csv';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { Transformer } from 'stream-transform';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CreateCustomerIfDto } from './dtos/createCustomerIf.dto';
import { CreateOrderDetailIfDto } from './dtos/createOrderDetailIf.dto';
import { CreateOrderHeaderIf } from './dtos/createOrderHeaderIf.dto';
import { CreatePurchaseOrderDeadlineIfDto } from './dtos/createPurchaseOrderDeadlineIf.dto';
import { CreatePurchaseOrderDetailIfDto } from './dtos/createPurchaseOrderDetailIf.dto';
import { CreatePurchaseOrderHeaderIfDto } from './dtos/createPurchaseOrderHeaderIf.dto';
import { CreateSiteIfDto } from './dtos/createSiteIf.dto';
import { CreateSupplierIfDto } from './dtos/createSupplierIf.dto';
import { CreateTransferDetailIfDto } from './dtos/createTransferDetailIf.dto';
import { CreateTransferHeaderIfDto } from './dtos/createTransferHeaderIf.dto';
import { CreateWarehouseIfDto } from './dtos/createWarehouseIf.dto';
import {
  CreateMBaseIf,
  CreateSlipDeadlineIf,
  CreateSlipDetailIf,
  CreateSlipHeaderIf,
  IfCsvRecord,
  IfFileType,
  IfMBaseType,
  IfSlipType,
  IfType,
  MBaseIf,
  SignData,
  SlipFilterObj,
  SlipRecordObject,
  ValidateObject,
} from './if.type';

@Injectable()
export class IfService {
  private readonly logger = new Logger(IfService.name);

  constructor(
    private readonly importMBaseTransaction: ImportMBaseTransaction,
    private readonly importSlipTransaction: ImportSlipTransaction,
    private readonly asyncLockService: AsyncLockService,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly blobStorageService: BlobStorageService,
    private readonly dataSource: DataSource,
    private readonly deliveryService: DeliveryService,
    private readonly appConfigService: AppConfigService,

    private readonly mBaseRepository: MBaseRepository,
    private readonly tBatchMngRepository: TBatchMngRepository,
    private readonly tSlipHeaderRepository: TSlipHeaderRepository,
  ) {}

  manualImportIfMBase() {
    if (this.asyncLockService.isBusy(LockKey.IMPORT_BASE)) {
      return false;
    }

    this.importIfMBase();

    return true;
  }

  manualImportIfSlip() {
    if (this.asyncLockService.isBusy(LockKey.IMPORT_IF)) {
      return false;
    }

    this.importIfSlip();

    return true;
  }

  manualExportIfSign() {
    return this.exportIfSign();
  }

  importIfMBase() {
    return this.asyncLockService.acquireImportMBase(() =>
      Promise.all([
        this.importWarehouse(),
        this.importSite(),
        this.importCustomer(),
        this.importSupplier(),
      ]),
    );
  }

  importIfSlip() {
    return this.asyncLockService.acquireImportSlip(
      () =>
        Promise.all([
          this.importOrder(),
          this.importPurchaseOrder(),
          this.importTransfer(),
        ]),
      () => this.deliveryService.assignCourse(),
    );
  }

  async exportIfSign() {
    const currentDate = moment().format('YYYYMMDD');
    const destinationDir = `${IfType.SIGN}`;
    const fileName = `${destinationDir}/tms_order_completed_${currentDate}.csv`;

    this.logger.debug('Start exporting sign');

    try {
      const batchMng = await this.tBatchMngRepository.softUpdateExecTime({
        batchMngId: BatchMngId.IF_ESI001,
      });

      const signData = await this.getSignData(
        batchMng.lastExecTime,
        batchMng.thisExecTime,
        destinationDir,
      );

      if (signData.length) {
        this.logger.debug(`Start exporting sign: ${fileName}`);

        await this.blobStorageService.uploadBlobStream(
          fileName,
          stringify(signData, {
            quoted_string: true,
            record_delimiter: '\r\n',
          }),
        );

        this.logger.debug(`Done exporting sign: ${fileName}`);
      }

      await this.tBatchMngRepository.save(batchMng);

      this.logger.debug('Done exporting sign');
    } catch (error) {
      this.logger.error('Failed to export sign');
      console.dir(error);
    }
  }

  private importWarehouse() {
    return this.importMBaseData(
      IfMBaseType.WAREHOUSE,
      CreateWarehouseIfDto,
      record => ({
        baseCd: record.baseCd,
      }),
    );
  }

  private importSite() {
    return this.importMBaseData(IfMBaseType.SITE, CreateSiteIfDto, record => ({
      baseCd: record.baseCd,
    }));
  }

  private importSupplier() {
    return this.importMBaseData(
      IfMBaseType.SUPPLIER,
      CreateSupplierIfDto,
      record => ({
        baseCd: record.baseCd,
      }),
    );
  }

  private importCustomer() {
    return this.importMBaseData(
      IfMBaseType.CUSTOMER,
      CreateCustomerIfDto,
      record => ({
        baseCd: record.baseCd,
        baseEda: record.baseEda,
      }),
    );
  }

  private async importOrder() {
    return this.importSlipData(IfSlipType.ORDER, async value => {
      if (!value.head) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: {
              fileType: '受注見出',
            },
          }),
        );
      }

      if (!value.detail) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: {
              fileType: '受注明細',
            },
          }),
        );
      }

      const slipRecordObject: SlipRecordObject = {};

      await this.validateHeaderData(
        value.head,
        CreateOrderHeaderIf,
        slipRecordObject,
      );

      await this.validateDetailData(
        value.detail,
        CreateOrderDetailIfDto,
        slipRecordObject,
      );

      return slipRecordObject;
    });
  }

  private importPurchaseOrder() {
    return this.importSlipData(IfSlipType.PURCHASE_ORDER, async value => {
      if (!value.head) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: { fileType: '発注見出' },
          }),
        );
      }

      if (!value.detail) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: { fileType: '発注明細' },
          }),
        );
      }

      if (!value.deadline) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: { fileType: '発注納期' },
          }),
        );
      }

      const slipRecordObject: SlipRecordObject = {};

      await this.validateHeaderData(
        value.head,
        CreatePurchaseOrderHeaderIfDto,
        slipRecordObject,
      );

      await this.validateDetailData(
        value.detail,
        CreatePurchaseOrderDetailIfDto,
        slipRecordObject,
      );

      await this.validateDeadlineData(
        value.deadline,
        CreatePurchaseOrderDeadlineIfDto,
        slipRecordObject,
      );

      return slipRecordObject;
    });
  }

  private importTransfer() {
    return this.importSlipData(IfSlipType.TRANSFER, async value => {
      if (!value.head) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: { fileType: '移動見出' },
          }),
        );
      }

      if (!value.detail) {
        throw new Error(
          this.i18nService.t('errorMessage.if.IF_REQ001_002', {
            args: { fileType: '移動明細' },
          }),
        );
      }

      const slipRecordObject: SlipRecordObject = {};

      await this.validateHeaderData(
        value.head,
        CreateTransferHeaderIfDto,
        slipRecordObject,
      );

      await this.validateDetailData(
        value.detail,
        CreateTransferDetailIfDto,
        slipRecordObject,
      );

      return slipRecordObject;
    });
  }

  private async importMBaseData<K extends ClassConstructor<CreateMBaseIf>>(
    ifMBaseType: IfMBaseType,
    Schema: K,
    conditions: (record: MBaseIf) => FindOptionsWhere<MBaseEntity>,
  ) {
    this.logger.debug(`Start importing master base ${ifMBaseType}`);

    const files = await this.blobStorageService.getUnprocessedBlobsByPattern(
      IfType.MASTER_BASE,
      ifMBaseFilePattern(ifMBaseType),
    );

    const sortedFiles = [...files].sort((a, b) => a.localeCompare(b));

    for (const fileName of sortedFiles) {
      const key = fileName.slice(-18, -4);

      try {
        this.logger.debug(
          `Start importing master base ${ifMBaseType}: ${fileName}`,
        );

        const records = await this.validateMBaseData(fileName, Schema);

        await this.importMBaseTransaction.run(records, conditions);

        await this.blobStorageService.moveBlobToDir(
          fileName,
          `processed/${IfType.MASTER_BASE}/${key}`,
        );

        this.logger.debug(
          `Done importing master base ${ifMBaseType}: ${fileName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to import master base ${ifMBaseType}: ${fileName}`,
        );
        console.dir(error);

        await this.blobStorageService.moveBlobToDir(
          fileName,
          `error/${IfType.MASTER_BASE}/${key}`,
        );
      }
    }

    this.logger.debug(`Done importing master base ${ifMBaseType}`);
  }

  private async importSlipData(
    ifSlipType: IfSlipType,
    validateSlipData: (
      value: ValueOf<SlipFilterObj>,
    ) => Promise<SlipRecordObject>,
  ) {
    this.logger.debug(`Start importing slip ${ifSlipType}`);

    const files = await this.blobStorageService.getUnprocessedBlobsByPattern(
      IfType.SLIP,
      ifSLipFilePattern(ifSlipType),
    );
    const slipFilterObj = [...files]
      .sort((a, b) => {
        const timestampA = a.slice(-18, -4);
        const timestampB = b.slice(-18, -4);

        return timestampA.localeCompare(timestampB);
      })
      .reduce<SlipFilterObj>((prev, cur) => {
        const timestamp = cur.slice(-18, -4);
        const type = cur.replace(`${IfType.SLIP}/`, '').split('_')[0] as string;

        prev[timestamp] = { ...prev[timestamp], [type]: cur };

        return prev;
      }, {});

    for (const [key, value] of Object.entries(slipFilterObj)) {
      const handleFiles = Object.values(value);
      const handleFilesStr = handleFiles.join(', ');

      try {
        this.logger.debug(
          `Start importing slip ${ifSlipType}: ${handleFilesStr}`,
        );

        const records = await validateSlipData(value);

        await this.importSlipTransaction.run(records, ifSlipType);

        await this.blobStorageService.moveMultipleBlobsToDir(
          handleFiles,
          `processed/${IfType.SLIP}/${key}`,
        );

        this.logger.debug(
          `Done importing slip ${ifSlipType}: ${handleFilesStr}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to import slip ${ifSlipType}: ${handleFilesStr}`,
        );
        console.dir(error);

        await this.blobStorageService.moveMultipleBlobsToDir(
          handleFiles,
          `error/${IfType.SLIP}/${key}`,
        );
      }
    }

    this.logger.debug(`Done importing slip ${ifSlipType}`);
  }

  private validateHeaderData<
    T extends CreateSlipHeaderIf,
    K extends ClassConstructor<T>,
  >(fileName: string, Schema: K, slipRecordObject: SlipRecordObject) {
    return this.validateIfData<K, void>(fileName, Schema, validateObject => {
      const { resolve, addError } = validateObject;

      return transform<IfCsvRecord<T>>(
        async ({ record, metadata }, cb) => {
          const isMBaseExist = await this.checkMBaseExistence(record, error =>
            addError(this.ifErrorMsg(metadata, error)),
          );
          if (!isMBaseExist) return cb();

          slipRecordObject[this.ifSlipKey(record.slipNo, record.seqNo)] = {
            metadata,
            record: record.toSlipHeader(),
            detail: {},
          };

          cb();
        },
        () => {
          if (validateObject.isError) return;

          resolve();
        },
      );
    });
  }

  private validateDetailData<
    T extends CreateSlipDetailIf,
    K extends ClassConstructor<T>,
  >(fileName: string, Schema: K, slipRecordObject: SlipRecordObject) {
    return this.validateIfData<K, void>(fileName, Schema, validateObject => {
      const { resolve, addError } = validateObject;

      return transform<IfCsvRecord<T>>(
        ({ record, metadata }) => {
          const headerKey = this.ifSlipKey(record.slipNo, record.seqNo);

          if (!slipRecordObject[headerKey]) {
            return addError(
              this.ifErrorMsg(
                metadata,
                this.i18nService.t(`errorMessage.if.IF_REQ001_004`, {
                  args: { key: headerKey, file1: '詳細', file2: 'ヘッダー' },
                }),
              ),
            );
          }

          const detailKey = this.ifSlipKey(
            record.slipNo,
            record.seqNo,
            record.gyoNo,
          );
          (<SlipRecordObject[string]>slipRecordObject[headerKey]).detail[
            detailKey
          ] = {
            metadata,
            record: record.toSlipDetail(),
            deadline: {},
          };
        },
        () => {
          Object.entries(slipRecordObject).forEach(
            ([key, { metadata, detail }]) => {
              if (isEmpty(detail)) {
                addError(
                  this.ifErrorMsg(
                    metadata,
                    this.i18nService.t(`errorMessage.if.IF_REQ001_004`, {
                      args: { key, file1: 'ヘッダー', file2: '詳細' },
                    }),
                  ),
                );
              }
            },
          );

          if (validateObject.isError) return;

          resolve();
        },
      );
    });
  }

  private validateDeadlineData<
    T extends CreateSlipDeadlineIf,
    K extends ClassConstructor<T>,
  >(fileName: string, Schema: K, slipRecordObject: SlipRecordObject) {
    return this.validateIfData<K, void>(fileName, Schema, validateObject => {
      const { resolve, addError } = validateObject;

      return transform<IfCsvRecord<T>>(
        ({ record, metadata }) => {
          const headerKey = this.ifSlipKey(record.slipNo, record.seqNo);
          const detailKey = this.ifSlipKey(
            record.slipNo,
            record.seqNo,
            record.gyoNo,
          );

          if (!slipRecordObject[headerKey]?.detail[detailKey]) {
            return addError(
              this.ifErrorMsg(
                metadata,
                this.i18nService.t(`errorMessage.if.IF_REQ001_004`, {
                  args: { key: detailKey, file1: '納期', file2: '詳細' },
                }),
              ),
            );
          }

          const deadlineKey = this.ifSlipKey(
            record.slipNo,
            record.seqNo,
            record.gyoNo,
            record.deadlineNo,
          );
          (<SlipRecordObject[string]['detail'][string]>(
            (<SlipRecordObject[string]>slipRecordObject[headerKey]).detail[
              detailKey
            ]
          )).deadline[deadlineKey] = {
            record: record.toSlipDeadline(),
          };
        },
        () => {
          Object.keys(slipRecordObject).forEach(key => {
            Object.entries(
              (<SlipRecordObject[string]>slipRecordObject[key]).detail,
            ).forEach(([key, { metadata, deadline }]) => {
              if (isEmpty(deadline)) {
                addError(
                  this.ifErrorMsg(
                    metadata,
                    this.i18nService.t(`errorMessage.if.IF_REQ001_004`, {
                      args: { key, file1: '詳細', file2: '納期' },
                    }),
                  ),
                );
              }
            });
          });

          if (validateObject.isError) return;

          resolve();
        },
      );
    });
  }

  private validateMBaseData<
    T extends CreateMBaseIf,
    K extends ClassConstructor<T>,
  >(fileName: string, Schema: K) {
    return this.validateIfData<K, MBaseIf[]>(
      fileName,
      Schema,
      validateObject => {
        const { resolve } = validateObject;

        return transform<IfCsvRecord<T>>(
          ({ record }) => record.toMBase(),
          (_, records) => {
            if (validateObject.isError) return;

            resolve(records as unknown as MBaseIf[]);
          },
        );
      },
    );
  }

  private validateIfData<T extends ClassConstructor<object>, K = any>(
    fileName: string,
    Schema: T,
    transformDataStream: (validateObj: ValidateObject<K>) => Transformer,
  ) {
    const validateErrors: string[] = [];
    let isParseError = false;

    return new Promise<K>((resolve, reject) => {
      const validateObject = {
        resolve,
        addError: (error: string) => {
          validateErrors.push(error);
        },
        get isError() {
          return validateErrors.length > 0 || isParseError;
        },
      } satisfies ValidateObject<K>;

      this.blobStorageService
        .downloadBlobStream(fileName)
        .then(downloadIfDataStream => {
          pipeline(
            downloadIfDataStream,
            this.parseIfDataStream(
              fileName,
              Schema,
              () => (isParseError = true),
            ),
            this.pipeIfDataStream(Schema, validateObject.addError),
            transformDataStream(validateObject),
            err => {
              if (err) {
                validateObject.addError(err.message);
              }

              if (validateObject.isError) {
                return reject(new Error(JSON.stringify(validateErrors)));
              }
            },
          );
        });
    });
  }

  private parseIfDataStream(
    fileName: string,
    Schema: ClassConstructor,
    setParseError: () => void,
  ) {
    return parse({
      columns: Object.getOwnPropertyNames(new Schema()),
      skipEmptyLines: true,
      skipRecordsWithEmptyValues: true,
      relaxColumnCount: true,
      cast: value => value || null,
      onRecord: (record, { lines }) => {
        const ifLimitRecord = this.appConfigService.ifConfig.limitRecord;

        if (ifLimitRecord && lines > ifLimitRecord) {
          setParseError();
          throw new Error(
            this.ifErrorMsg(
              { fileName, lines },
              this.i18nService.t('errorMessage.if.RECORD_LIMIT'),
            ),
          );
        }

        return {
          record,
          metadata: { lines, fileName },
        } satisfies IfCsvRecord;
      },
    });
  }

  private pipeIfDataStream<T extends object, K extends ClassConstructor<T>>(
    Schema: K,
    addError: (error: string) => void,
  ) {
    return transform<IfCsvRecord<T>>(async ({ record, metadata }, cb) => {
      const recordInstance = plainToInstance(Schema, <object>record, {
        enableImplicitConversion: true,
      });

      const errors = await this.i18nService.validate(recordInstance);

      if (errors.length) {
        const errorMsg = handleClassValidatorErr(errors);
        addError(this.ifErrorMsg(metadata, errorMsg));
      }

      cb(null, { record: recordInstance, metadata } satisfies IfCsvRecord<T>);
    });
  }

  private checkValidHeader(
    ifFileType: IfFileType,
    record: Record<string, string>,
  ) {
    const headerObj = {
      [IfFileType.WAREHOUSE]:
        '倉庫コード,倉庫名,倉庫略称,倉庫カナ,倉庫電話番号,倉庫都道府県コード,倉庫郵便番号,倉庫住所１,倉庫住所２,倉庫住所３,削除フラグ',
      [IfFileType.SITE]:
        '現場コード,現場名1,現場名2,現場略称,現場カナ,現場電話番号,現場都道府県コード,現場郵便番号,現場住所1,現場住所2,削除フラグ',
      [IfFileType.SUPPLIER]:
        '仕入先コード,仕入先名1,仕入先名2,仕入先略称,仕入先カナ,仕入先電話番号,仕入先都道府県コード,仕入先郵便番号,仕入先住所1,仕入先住所2,仕入先住所3,削除フラグ',
      [IfFileType.CUSTOMER]:
        '得意先コード,枝番,納品先名1,納品先名2,得意先略称,得意先カナ,得意先電話番号,得意先都道府県コード,得意先郵便番号,得意先住所1,得意先住所2,得意先住所3,削除フラグ',
      [IfFileType.ORDER_HEADER]:
        '受注伝票No,SeqNo,営業所コード,営業所名称,営業担当者コード,営業担当者名称,入力担当者コード,入力担当者名称,出荷倉庫コード,納期日,出荷予定日,得意先コード,得意先枝番,現場コード,納品先コード,納品先枝番,備考テキスト,配送区分,配送業者,工場倉庫コード,削除フラグ',
      [IfFileType.ORDER_DETAIL]:
        '受注伝票No,SeqNo,受注行No,商品名称,サイズ,入数,受注ケース数量,受注ケース単位,受注バラ数量,受注バラ単位,総バラ数量,備考テキスト,削除フラグ',
      [IfFileType.PURCHASE_ORDER_HEADER]:
        '発注伝票No,SeqNo,仕入先コード,発注営業所コード,発注営業所名称,発注担当者コード,発注担当者名称,入荷倉庫コード,配送区分,引取情報,仕入担当者,受注伝票No,受注SeqNo,備考テキスト,運送会社,削除フラグ',
      [IfFileType.PURCHASE_ORDER_DETAIL]:
        '発注伝票No,SeqNo,発注行No,商品名称,サイズ,入数,発注ケース数量,発注ケース単位,発注バラ数量,発注バラ単位,総バラ数量,備考テキスト,受注伝票No,受注SeqNo,受注行No,削除フラグ',
      [IfFileType.PURCHASE_ORDER_DEADLINE]:
        '発注伝票No,SeqNo,発注行No,納期行No,発注ケース数量,発注バラ数量,総バラ数量,回答納期日,削除フラグ',
      [IfFileType.TRANSFER_HEADER]:
        '在庫移動No,SeqNo,移動担当者コード,移動担当者名称,移動元倉庫コード,移動先倉庫コード,移動出荷日付,移動入荷日付,備考テキスト,運送会社,削除フラグ',
      [IfFileType.TRANSFER_DETAIL]:
        '在庫移動No,SeqNo,在庫移動行No,商品名称,サイズ,入数,移動ケース数量,移動ケース単位,移動出荷バラ数量,出荷バラ単位,移動総バラ数量,削除フラグ',
    };

    return headerObj[ifFileType] === Object.values(record).join().trim();
  }

  private ifSlipKey(...params: (string | number)[]) {
    return params.join('_');
  }

  private async checkMBaseExistence(
    record: CreateSlipHeaderIf,
    onNotFound: (err: string) => void,
  ) {
    const conditions = [
      { baseCd: record.shippingWarehouseCd },
      {
        baseCd: record.customerAddressCd,
        baseEda: record.customerAddressBranch,
      },
      {
        baseCd: record.siteCd,
      },
      {
        baseCd: record.deliveryDestinationCd,
        baseEda: record.deliveryDestinationBranch,
      },
      {
        baseCd: record.factoryWarehouseCd,
      },
      {
        baseCd: record.supplierCd,
      },
      {
        baseCd: record.receivingWarehouseCd,
      },
      {
        baseCd: record.sourceWarehouseCd,
      },
      {
        baseCd: record.destinationWarehouseCd,
      },
    ];

    try {
      const findMBasePromises = conditions
        .filter(condition => !isEmpty(omitUndefined(condition)))
        .map(condition =>
          this.mBaseRepository.findOneByOrFail(condition).catch(err => {
            onNotFound(
              this.i18nService.t('errorMessage.if.IF_REQ001_003', {
                args: {
                  conditions: JSON.stringify(condition),
                },
              }),
            );

            throw err;
          }),
        );

      await Promise.all(findMBasePromises);

      return true;
    } catch (error) {
      return false;
    }
  }

  private ifErrorMsg(metadata: IfCsvRecord['metadata'], msg: string) {
    return `${metadata.lines}行目での${metadata.fileName}: ${msg}`;
  }

  private async getSignData(
    lastExecTime: Date,
    thisExecTime: Date,
    destinationDir: string,
  ) {
    const getMaxTripServiceYmdQuery = this.dataSource
      .createQueryBuilder()
      .select('MAX(tTrip.serviceYmd)')
      .from(TTripEntity, 'tTrip')
      .where('tTrip.slipNo = tSlipHeader.slipNo')
      .getQuery();

    const data = await this.tSlipHeaderRepository
      .createQueryBuilder('tSlipHeader')
      .select([
        'tSlipHeader.slipNo as slipNo',
        'DATE_FORMAT(tTrip.serviceYmd, "%Y-%m-%d") as deadline',
        'tSpot.workEndTime as workEndTime',
        'tSlipHeader.slipStatusDiv as slipStatusDiv',
        'mTransportCompany.transportCompanyNm as transportCompanyNm',
        'mDriver.driverNm as driverNm',
        'tSlipHeader.electronicSignatureImage as electronicSignatureImage',
      ])
      .innerJoin(
        'tSlipHeader.tTrips',
        'tTrip',
        `tTrip.serviceYmd = ( ${getMaxTripServiceYmdQuery} )`,
      )
      .innerJoin('tTrip.tSpots', 'tSpot')
      .innerJoin('tTrip.tCourse', 'tCourse')
      .innerJoin('tCourse.transportCompany', 'mTransportCompany')
      .leftJoin('tCourse.driver', 'mDriver')
      .where('tSlipHeader.fixedFlg = :fixedFlg', { fixedFlg: true })
      .andWhere('tSlipHeader.updDatetime > :lastExecTime', {
        lastExecTime,
      })
      .andWhere('tSlipHeader.updDatetime <= :thisExecTime', {
        thisExecTime,
      })
      .getRawMany<SignData>();

    const signData = data
      .filter(item => item.electronicSignatureImage !== null)
      .map(async item => {
        let imageName: string | null = null;

        if (item.electronicSignatureImage) {
          const extension = path.extname(item.electronicSignatureImage);
          imageName = `${item.slipNo}${extension}`;

          await this.blobStorageService.copyFromUrlToDestination(
            item.electronicSignatureImage,
            `${destinationDir}/${imageName}`,
          );
        }

        return {
          伝票No: item.slipNo,
          納品日: item.deadline,
          完了時間: item.workEndTime,
          ステータス: item.slipStatusDiv,
          運送会社: item.transportCompanyNm,
          配送員: item.driverNm,
          画像ファイル名: imageName,
        };
      });

    return Promise.all(signData);
  }
}
