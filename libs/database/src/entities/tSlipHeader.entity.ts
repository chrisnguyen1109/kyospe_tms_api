import { DeliveryDiv, SlipStatusDiv } from '@app/common/types/div.type';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TSlipDetailEntity } from './tSlipDetail.entity';
import { TTripEntity } from './tTrip.entity';

@Index(['slipNoForPurchaseOrder'], { unique: false })
@Entity()
export class TSlipHeaderEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: '伝票No.',
    length: 11,
  })
  slipNo: string;

  @Column({ nullable: true, comment: 'SeqNo' })
  seqNo?: number;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '配送状況区分',
  })
  slipStatusDiv?: SlipStatusDiv;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '配送区分;配送、引取、直送',
  })
  deliveryDiv?: DeliveryDiv;

  @Column({
    nullable: true,
    comment: '仕入先コード',
    length: 7,
  })
  supplierCd?: string;

  @Column({
    nullable: true,
    comment: '仕入担当者名称',
    length: 128,
  })
  procurementOfficerNm?: string;

  @Column({
    nullable: true,
    comment: '営業所',
    length: 128,
  })
  salesOffice?: string;

  @Column({
    nullable: true,
    comment: '営業担当者名称',
    length: 128,
  })
  salesRepresentativeNm?: string;

  @Column({
    nullable: true,
    comment: '入力担当者名称',
    length: 128,
  })
  inputStaffNm?: string;

  @Column({
    nullable: true,
    comment: '移動担当者名称',
    length: 128,
  })
  transferStaffNm?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: '出荷日付',
  })
  shippingDate?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: '納期・移動入荷日付',
  })
  receivingDate?: string;

  @Column({
    nullable: true,
    comment: '入荷倉庫コード',
    length: 7,
  })
  receivingWarehouseCd?: string;

  @Column({
    nullable: true,
    comment: '出荷倉庫コード',
    length: 7,
  })
  shippingWarehouseCd?: string;

  @Column({
    nullable: true,
    comment: '移動元倉庫コード',
    length: 7,
  })
  sourceWarehouseCd?: string;

  @Column({
    nullable: true,
    comment: '移動先倉庫コード',
    length: 7,
  })
  destinationWarehouseCd?: string;

  @Column({
    nullable: true,
    comment: '得意先コード',
    length: 7,
  })
  customerCd?: string;

  @Column({
    nullable: true,
    comment: '得意先枝番',
    length: 4,
  })
  customerBranchNumber?: string;

  @Column({
    nullable: true,
    comment:
      '現場コード;現場納品の場合はこちらにデータが入り、\r\n現場納品でない場合は納品先にデータが入る認識',
    length: 20,
  })
  siteCd?: string;

  @Column({
    nullable: true,
    comment: '納品先コード',
    length: 7,
  })
  deliveryDestinationCd?: string;

  @Column({
    nullable: true,
    comment: '納品先枝番',
    length: 4,
  })
  deliveryDestinationBranchNum?: string;

  @Column({
    nullable: true,
    comment: '工場倉庫コード;自社製品の製造元',
    length: 7,
  })
  factoryWarehouseCd?: string;

  @Column({
    nullable: true,
    comment: '発注に対する受注伝票No.',
    length: 11,
  })
  slipNoForPurchaseOrder?: string;

  @Column({
    nullable: true,
    comment: '発注に対する受注SeqNo.',
  })
  seqNoForPurchaseOrder?: number;

  @Column({
    nullable: true,
    comment: '引取情報',
    length: 50,
  })
  pickupInformation?: string;

  @Column({ nullable: true, comment: '運送会社ID' })
  carrierId?: number;

  @Column({
    nullable: true,
    comment: '運送会社名称',
    length: 128,
  })
  carrierNm?: string;

  @Column({ nullable: true, comment: '備考', length: 50 })
  remarks?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '持ち戻りメモ',
  })
  returnMemo?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '配車コメント',
  })
  assignMemo?: string;

  @Column({ type: 'text', nullable: true, comment: '画像１' })
  image1?: string;

  @Column({ type: 'text', nullable: true, comment: '画像２' })
  image2?: string;

  @Column({ type: 'text', nullable: true, comment: '画像３' })
  image3?: string;

  @Column({ type: 'text', nullable: true, comment: '画像４' })
  image4?: string;

  @Column({ type: 'text', nullable: true, comment: '画像５' })
  image5?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '電子サイン画像',
  })
  electronicSignatureImage?: string;

  @DeleteDateColumn({
    nullable: true,
    comment: '削除日時',
  })
  deleteAt?: Date;

  @Column({
    default: false,
    comment: '確定フラグ',
  })
  fixedFlg: boolean;

  @Column({
    default: false,
    comment: '架台フラグ',
  })
  kadaiFlg: boolean;

  @Column({
    nullable: true,
    comment: '配達希望時間',
    length: 15,
  })
  requestDate?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '配送メモ',
  })
  deliveryMemo?: string;

  @OneToMany(() => TTripEntity, tTrip => tTrip.tSlipHeader, { cascade: true })
  tTrips: TTripEntity[];

  @OneToMany(() => TSlipDetailEntity, tSlipDetail => tSlipDetail.tSlipHeader, {
    cascade: true,
  })
  tSlipDetails: TSlipDetailEntity[];

  isFullImage() {
    return [
      this.image1,
      this.image2,
      this.image3,
      this.image4,
      this.image5,
    ].every(value => value != undefined);
  }

  getEmptyImageIndex() {
    return ([
      this.image1,
      this.image2,
      this.image3,
      this.image4,
      this.image5,
    ].findIndex(value => value == undefined) + 1) as 1 | 2 | 3 | 4 | 5;
  }
}
