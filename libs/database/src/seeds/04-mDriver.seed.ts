import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MDriverSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'DRIVER_ID',
      'TRANSPORT_COMPANY_ID',
      'CAR_ID',
      'DRIVER_NM',
      'DRIVER_NM_KN',
      'TEL_NUMBER',
    ];

    const data = await loadSeedingData(columns, 'MDriver');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_DRIVER')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
