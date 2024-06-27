import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class TSlipDetailSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'SLIP_NO',
      'GYO_NO',
      'PRODUCT_NM',
      'SIZE',
      'QUANTITY_PER_CASE',
      'NUMBER_OF_CASES',
      'UNIT_PER_CASE',
      'NUMBER_OF_ITEMS',
      'UNIT_PER_ITEM',
      'TOTAL_NUMBER',
      'SLIP_NO_FOR_PURCHASE_ORDER',
      'SEQ_NO_FOR_PURCHASE_ORDER',
      'GYO_NO_FOR_PURCHASE_ORDER',
      'REMARKS',
      'DELETE_AT',
    ];

    const data = await loadSeedingData(columns, 'TSlipDetail');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_SLIP_DETAIL')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
