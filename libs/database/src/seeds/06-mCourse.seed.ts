import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MCourseSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'COURSE_ID',
      'COURSE_NM',
      'TRANSPORT_COMPANY_ID',
      'START_BASE_ID',
      'ARRIVE_BASE_ID',
      'SERVICE_START_TIME',
      'SERVICE_END_TIME',
    ];

    const data = await loadSeedingData(columns, 'MCourse');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_COURSE')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
