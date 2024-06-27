import { CarSizeDiv, CarTypeDiv } from '@app/common/types/div.type';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MDriverEntity } from './mDriver.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { TCourseEntity } from './tCourse.entity';

@Entity()
export class MCarEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: '車両ID' })
  carId: number;

  @Column({ type: 'char', length: 2, comment: '車両タイプ' })
  carType: CarTypeDiv;

  @Column({ type: 'char', length: 2, comment: '車格' })
  carSize: CarSizeDiv;

  @Column({
    comment: '車両管理番号',
    length: 50,
  })
  carManagementNum: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'リース開始日付',
  })
  leaseStartYmd?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'リース終了日付',
  })
  leaseEndYmd?: string;

  @Column({ comment: '所有会社ID' })
  owningCompanyId: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.mCars,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: formatColumnName('owningCompanyId') })
  owningCompany: MTransportCompanyEntity;

  @OneToMany(() => MDriverEntity, mDriver => mDriver.car, { cascade: true })
  mDrivers: MDriverEntity[];

  @OneToMany(() => TCourseEntity, tCourse => tCourse.car, {
    cascade: true,
  })
  tCourses: TCourseEntity[];
}
