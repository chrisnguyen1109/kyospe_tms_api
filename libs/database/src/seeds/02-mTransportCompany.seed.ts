import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MTransportCompanySeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'TRANSPORT_COMPANY_ID',
      'TRANSPORT_COMPANY_NM',
      'TEL_NUMBER',
      'PARENT_COMPANY_ID',
      'CARRIAGE_BASE_ID',
    ];

    const data = await loadSeedingData(columns, 'MTransportCompany');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_TRANSPORT_COMPANY')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
