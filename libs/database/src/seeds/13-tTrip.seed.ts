import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class TTripSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'TRIP_ID',
      'SLIP_NO',
      'COURSE_SEQ_NO',
      'SERVICE_YMD',
      'START_BASE_ID',
      'ARRIVE_BASE_ID',
    ];

    const data = await loadSeedingData(columns, 'TTrip');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_TRIP')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
