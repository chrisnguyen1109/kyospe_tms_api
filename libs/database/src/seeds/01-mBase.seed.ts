import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MBaseSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'BASE_ID',
      'BASE_CD',
      'BASE_EDA',
      'BASE_DIV',
      'BASE_NM_1',
      'BASE_NM_2',
      'BASE_NM_AB',
      'BASE_NM_KN',
      'TEL_NUMBER',
      'LATITUDE',
      'LONGITUDE',
      'PREF_CD',
      'AREA_DIV',
      'POST_CD',
      'ADDRESS_1',
      'ADDRESS_2',
      'ADDRESS_3',
      'BASE_MEMO',
      'SORT_ORDER',
    ];

    const data = await loadSeedingData(columns, 'MBase');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_BASE')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
