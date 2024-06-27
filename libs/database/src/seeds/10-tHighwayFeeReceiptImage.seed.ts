import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class THighwayFeeReceiptImageSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = ['IMAGE_NO', 'HIGHWAY_FEE_NO', 'RECEIPT_IMAGE'];

    const data = await loadSeedingData(columns, 'THighwayFeeReceiptImage');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_HIGHWAY_FEE_RECEIPT_IMAGE')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
