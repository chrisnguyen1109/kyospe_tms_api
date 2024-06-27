import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class TSpotSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'SPOT_ID',
      'TRIP_ID',
      'STATUS_DIV',
      'SPOT_DIV',
      'BASE_ID',
      'BASE_NM',
      'LATITUDE',
      'LONGITUDE',
      'TEL_NUMBER',
      'POST_CD',
      'ADDRESS_1',
      'ADDRESS_2',
      'ADDRESS_3',
      'ORDER',
      'WORK_END_TIME',
      'WORK_KINDS_DIV',
      'WORK_MEMO',
    ];

    const data = await loadSeedingData(columns, 'TSpot');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_SPOT')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
