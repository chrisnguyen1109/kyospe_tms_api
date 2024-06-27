import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';
import { MBaseEntity } from '../entities/mBase.entity';
import { BaseTransaction } from './base.transaction';
import { MBaseIf } from '@batch/if/if.type';
import { GoogleService } from '@app/google/google.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ImportMBaseTransaction extends BaseTransaction<MBaseIf[], void> {
  private readonly logger = new Logger(ImportMBaseTransaction.name);

  constructor(
    protected override readonly dataSource: DataSource,
    private readonly googleService: GoogleService,
  ) {
    super(dataSource);
  }

  override async execute(
    records: MBaseIf[],
    manager: EntityManager,
    conditions: (record: MBaseIf) => FindOptionsWhere<MBaseEntity>,
  ) {
    for (const record of records) {
      const { deleteFlg, ...data } = record;
      const address = `${data.address1 ?? ''} ${data.address2 ?? ''} ${
        data.address3 ?? ''
      }`.trim();

      const existBase = await manager.findOneBy(
        MBaseEntity,
        conditions(record),
      );

      if (!existBase && deleteFlg) {
        continue;
      }

      if (!existBase) {
        const { lat, lng } = await this.getMBaseLatLng(address);

        if (lat) data.latitude = lat;
        if (lng) data.longitude = lng;

        await manager.save(MBaseEntity, data);
        continue;
      }

      if (existBase.baseDiv !== record.baseDiv) {
        continue;
      }

      if (deleteFlg) {
        await manager.remove(existBase);
        continue;
      }

      const existAddress = `${existBase.address1 ?? ''} ${
        existBase.address2 ?? ''
      } ${existBase.address3 ?? ''}`.trim();
      if (existAddress !== address) {
        const { lat, lng } = await this.getMBaseLatLng(address);

        if (lat) data.latitude = lat ?? existBase.latitude;
        if (lng) data.longitude = lng ?? existBase.longitude;
      }

      Object.assign(existBase, data);

      await manager.save(existBase);
    }
  }

  private async getMBaseLatLng(address: string) {
    let lat = '';
    let lng = '';
    if (address?.trim()) {
      try {
        const response = await this.googleService.getGeocode(address);

        const latlng = response.results[0]?.geometry.location;
        lat = latlng?.lat.toString() || '';
        lng = latlng?.lng.toString() || '';
        this.logger.log(`lat, lng: ${lat}, ${lng}`);
      } catch(e) {
        this.logger.log(e);
      }
    }
    return {
      lat,
      lng,
    };
  }
}
