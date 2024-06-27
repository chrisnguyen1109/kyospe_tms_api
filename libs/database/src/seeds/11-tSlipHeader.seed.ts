import { loadSeedingData } from '@app/common/utils/loadSeedingData.util';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class TSlipHeaderSeed implements Seeder {
  public async run(_factory: Factory, datasource: DataSource) {
    const columns = [
      'SLIP_NO',
      'SEQ_NO',
      'SLIP_STATUS_DIV',
      'DELIVERY_DIV',
      'SUPPLIER_CD',
      'PROCUREMENT_OFFICER_NM',
      'SALES_OFFICE',
      'SALES_REPRESENTATIVE_NM',
      'INPUT_STAFF_NM',
      'TRANSFER_STAFF_NM',
      'SHIPPING_DATE',
      'RECEIVING_DATE',
      'RECEIVING_WAREHOUSE_CD',
      'SHIPPING_WAREHOUSE_CD',
      'SOURCE_WAREHOUSE_CD',
      'DESTINATION_WAREHOUSE_CD',
      'CUSTOMER_CD',
      'CUSTOMER_BRANCH_NUMBER',
      'SITE_CD',
      'DELIVERY_DESTINATION_CD',
      'DELIVERY_DESTINATION_BRANCH_NUM',
      'FACTORY_WAREHOUSE_CD',
      'SLIP_NO_FOR_PURCHASE_ORDER',
      'SEQ_NO_FOR_PURCHASE_ORDER',
      'PICKUP_INFORMATION',
      'CARRIER_ID',
      'CARRIER_NM',
      'REMARKS',
      'RETURN_MEMO',
      'IMAGE_1',
      'IMAGE_2',
      'IMAGE_3',
      'IMAGE_4',
      'IMAGE_5',
      'ELECTRONIC_SIGNATURE_IMAGE',
      'DELETE_AT',
    ];

    const data = await loadSeedingData(columns, 'TSlipHeader');

    for (const item of data) {
      await datasource
        .createQueryBuilder()
        .insert()
        .into('T_SLIP_HEADER')
        .values(item)
        .orUpdate(columns, undefined, { skipUpdateIfNoValuesChanged: true })
        .execute();
    }
  }
}
