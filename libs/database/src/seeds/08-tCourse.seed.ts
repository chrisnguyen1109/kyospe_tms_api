import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class TCourseSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'COURSE_SEQ_NO',
      'COURSE_ID',
      'DISPATCH_STATUS_DIV',
      'DELIVERY_STATUS_DIV',
      'SERVICE_YMD',
      'START_TIME',
      'END_TIME',
      'START_BASE_ID',
      'ARRIVE_BASE_ID',
      'TRANSPORT_COMPANY_ID',
      'CAR_ID',
      'DRIVER_ID',
      'ACTUAL_START_TIME',
      'ACTUAL_END_TIME',
      'SIGNBOARD_PHOTO_1',
      'SIGNBOARD_PHOTO_2',
      'SIGNBOARD_PHOTO_3',
      'SIGNBOARD_PHOTO_4',
      'SIGNBOARD_PHOTO_5',
      'SIGNBOARD_PHOTO_6',
    ];

    const data = await loadSeedingData(columns, 'TCourse');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_COURSE')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
