import { AreaDiv, BaseDiv } from '@app/common/types/div.type';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MCourseEntity } from './mCourse.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { MUserEntity } from './mUser.entity';
import { TCourseEntity } from './tCourse.entity';
import { TSpotEntity } from './tSpot.entity';
import { TTripEntity } from './tTrip.entity';

@Index(['baseCd', 'baseEda'], { unique: false })
@Entity()
export class MBaseEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: '拠点ID' })
  baseId: number;

  @Column({ comment: '拠点コード', length: 20 })
  baseCd: string;

  @Column({
    nullable: true,
    comment: '拠点枝番',
    length: 4,
  })
  baseEda?: string;

  @Column({
    type: 'char',
    length: 2,
    comment:
      '拠点区分:01：倉庫\r\n02：現場\r\n03：得意先\r\n04：納品先\r\n05：仕入先',
  })
  baseDiv: BaseDiv;

  @Column({ comment: '拠点名称１', length: 128 })
  baseNm1: string;

  @Column({
    nullable: true,
    comment: '拠点名称２',
    length: 128,
  })
  baseNm2?: string;

  @Column({
    nullable: true,
    comment: '拠点名称略称',
    length: 128,
  })
  baseNmAb?: string;

  @Column({
    nullable: true,
    comment: '拠点名称ふりがな',
    length: 128,
  })
  baseNmKn?: string;

  @Column({
    nullable: true,
    comment: '電話番号',
    length: 15,
  })
  telNumber?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '緯度',
    precision: 17,
    scale: 14,
  })
  latitude?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '経度',
    precision: 17,
    scale: 14,
  })
  longitude?: string;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '都道府県コード',
  })
  prefCd?: string;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '地域区分',
  })
  areaDiv?: AreaDiv;

  @Column({
    nullable: true,
    type: 'char',
    comment: '郵便番号',
    length: 7,
  })
  postCd?: string;

  @Column({ comment: '住所１', length: 256 })
  address1: string;

  @Column({
    nullable: true,
    comment: '住所２',
    length: 256,
  })
  address2?: string;

  @Column({
    nullable: true,
    comment: '住所３',
    length: 256,
  })
  address3?: string;

  @Column({ type: 'text', nullable: true, comment: '地点メモ' })
  baseMemo?: string;

  @Column({
    nullable: true,
    comment: '表示順',
  })
  sortOrder: number;

  @OneToMany(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.carriageBase,
    { cascade: true },
  )
  mTransportCompanies: MTransportCompanyEntity[];

  @OneToMany(() => MUserEntity, mUser => mUser.mainBase, { cascade: true })
  mUsers: MUserEntity[];

  @OneToMany(() => MCourseEntity, mCourse => mCourse.startBase, {
    cascade: true,
  })
  startMCourses: MCourseEntity[];

  @OneToMany(() => MCourseEntity, mCourse => mCourse.arriveBase, {
    cascade: true,
  })
  arriveMCourses: MCourseEntity[];

  @OneToMany(() => TCourseEntity, tCourse => tCourse.startBase, {
    cascade: true,
  })
  startTCourses: TCourseEntity[];

  @OneToMany(() => TCourseEntity, tCourse => tCourse.arriveBase, {
    cascade: true,
  })
  arriveTCourses: TCourseEntity[];

  @OneToMany(() => TTripEntity, tTrip => tTrip.startBase, {
    cascade: true,
  })
  startTrips: TTripEntity[];

  @OneToMany(() => TTripEntity, tTrip => tTrip.arriveBase, {
    cascade: true,
  })
  arriveTrips: TTripEntity[];

  @OneToMany(() => TSpotEntity, tSpot => tSpot.base, {
    cascade: true,
  })
  tSpots: TSpotEntity[];
}
