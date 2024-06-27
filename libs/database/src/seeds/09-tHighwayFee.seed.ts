import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class THighwayFeeSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'HIGHWAY_FEE_NO',
      'COURSE_SEQ_NO',
      'PAYMENT_METHOD_DIV',
      'AMOUNT',
    ];

    const data = await loadSeedingData(columns, 'THighwayFee');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_HIGHWAY_FEE')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
