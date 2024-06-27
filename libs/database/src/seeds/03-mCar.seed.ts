import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MCarSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'CAR_ID',
      'CAR_TYPE',
      'CAR_SIZE',
      'CAR_MANAGEMENT_NUM',
      'OWNING_COMPANY_ID',
      'LEASE_START_YMD',
      'LEASE_END_YMD',
    ];

    const data = await loadSeedingData(columns, 'MCar');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_CAR')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
