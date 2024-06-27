import { AppConfigService } from '@app/app-config/appConfig.service';
import { I18nTranslations } from '@app/i18n/i18n.type';
import {
  BlobHTTPHeaders,
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { IfType } from '@batch/if/if.type';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { Readable } from 'node:stream';

@Injectable()
export class BlobStorageService {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerClient: ContainerClient;
  private readonly sharedKeyCredential: StorageSharedKeyCredential;

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.appConfigService.blobStorageConfig.accountName,
      this.appConfigService.blobStorageConfig.accountKey,
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${this.appConfigService.blobStorageConfig.accountName}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.appConfigService.blobStorageConfig.containerName,
    );
  }

  async getUnprocessedBlobsByPattern(ifType: IfType, pattern: RegExp) {
    const blobs = this.containerClient.listBlobsFlat({
      prefix: ifType,
    });
    const blobNames: string[] = [];

    for await (const blob of blobs) {
      const blobName = blob.name;

      if (pattern.test(blobName)) {
        blobNames.push(blobName);
      }
    }

    return blobNames;
  }

  async moveBlobToDir(blobName: string, destinationDir: string) {
    const blobNameArr = blobName.split('/');
    const destinationName = `${destinationDir}/${
      blobNameArr[blobNameArr.length - 1]
    }`;

    await this.moveBlobToDestination(blobName, destinationName);

    return destinationName;
  }

  async moveMultipleBlobsToDir(blobNames: string[], destinationDir: string) {
    return Promise.all(
      blobNames.map(async blobName => {
        const blobNameArr = blobName.split('/');
        const destinationName = `${destinationDir}/${
          blobNameArr[blobNameArr.length - 1]
        }`;

        await this.moveBlobToDestination(blobName, destinationName);

        return destinationName;
      }),
    );
  }

  private async moveBlobToDestination(
    sourceName: string,
    destinationName: string,
  ) {
    const sourceBlobClient = this.containerClient.getBlobClient(sourceName);
    const destinationBlobClient =
      this.containerClient.getBlobClient(destinationName);

    const copyResponse = await destinationBlobClient.beginCopyFromURL(
      sourceBlobClient.url,
    );

    if (!copyResponse.isDone()) {
      throw new Error(
        this.i18nService.t('errorMessage.if.MOVE_ERROR', {
          args: { sourceName, destinationName },
        }),
      );
    }

    await sourceBlobClient.delete();
  }

  async copyFromUrlToDestination(sourceUrl: string, destinationName: string) {
    const destinationBlobClient =
      this.containerClient.getBlobClient(destinationName);

    const copyResponse = await destinationBlobClient.beginCopyFromURL(
      sourceUrl,
    );

    if (!copyResponse.isDone()) {
      throw new Error();
    }

    return destinationBlobClient.url;
  }

  async downloadBlobStream(blobName: string) {
    const blobClient = this.containerClient.getBlobClient(blobName);

    const downloadBlobResponse = await blobClient.download();

    if (!downloadBlobResponse.readableStreamBody) {
      throw new Error(
        this.i18nService.t('errorMessage.if.DOWNLOAD_ERROR', {
          args: { blobName },
        }),
      );
    }

    return downloadBlobResponse.readableStreamBody;
  }

  uploadBlobStream(blobName: string, readableStream: Readable) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    return blockBlobClient.uploadStream(readableStream);
  }

  uploadBlobData(
    blobName: string,
    data: Buffer,
    blobHTTPHeaders: BlobHTTPHeaders,
  ) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    return blockBlobClient.uploadData(data, {
      blobHTTPHeaders,
    });
  }

  deleteBlobIfExists(blobName: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    return blockBlobClient.deleteIfExists({ deleteSnapshots: 'include' });
  }

  getBlobNameFromUrl(url: string) {
    return url.replace(
      `https://${this.appConfigService.blobStorageConfig.accountName}.blob.core.windows.net/${this.appConfigService.blobStorageConfig.containerName}/`,
      '',
    );
  }

  generatePublicUrl(
    url: string,
    expiresOn: Date = moment().add(15, 'minutes').toDate(),
  ) {
    const blobName = this.getBlobNameFromUrl(url);
    const permissions = BlobSASPermissions.from({ read: true });

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.appConfigService.blobStorageConfig.containerName,
        blobName,
        permissions,
        startsOn: new Date(),
        expiresOn,
      },
      this.sharedKeyCredential,
    ).toString();

    return `${url}?${sasToken}`;
  }
}
