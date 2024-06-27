import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import argon from 'argon2';

export default class MUserSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'M_USER_ID',
      'USER_ID',
      'USER_NM',
      'USER_NM_KN',
      'MAIL_ADDRESS',
      'ROLE_DIV',
      'PASSWORD',
      'TRANSPORT_COMPANY_ID',
      'MAIN_BASE_ID',
      'DRIVER_ID',
    ];

    const data = await loadSeedingData(columns, 'MUser');

    for (const item of data) {
      const hashPassword = await argon.hash(<string>item['PASSWORD']);

      await datasource
        .createQueryBuilder()
        .insert()
        .into('M_USER')
        .values({ ...item, PASSWORD: hashPassword })
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
