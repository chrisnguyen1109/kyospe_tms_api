import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MCourseTripRelationshipSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'COURSE_ID',
      'TRANSPORT_COMPANY_ID',
      'START_BASE_ADDRESS_1',
      'START_BASE_ADDRESS_2',
      'ARRIVE_BASE_ADDRESS_1',
      'ARRIVE_BASE_ADDRESS_2',
    ];

    const data = await loadSeedingData(columns, 'MCourseTripRelationship');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_COURSE_TRIP_RELATIONSHIP')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
