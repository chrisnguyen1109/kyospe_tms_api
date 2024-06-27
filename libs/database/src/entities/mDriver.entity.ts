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
import { MCarEntity } from './mCar.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { MUserEntity } from './mUser.entity';
import { TCourseEntity } from './tCourse.entity';

@Entity()
export class MDriverEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: '配送員ID' })
  driverId: number;

  @Column({ comment: '配送員名称', length: 128 })
  driverNm: string;

  @Column({
    nullable: true,
    comment: '配送員名称ふりがな',
    length: 128,
  })
  driverNmKn?: string;

  @Column({
    nullable: true,
    comment: '電話番号',
    length: 15,
  })
  telNumber?: string;

  @Column({ nullable: true, comment: '車両ID' })
  carId?: number;

  @ManyToOne(() => MCarEntity, mCar => mCar.mDrivers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('carId') })
  car?: MCarEntity;

  @Column({ comment: '運送会社ID' })
  transportCompanyId: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.mDrivers,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: formatColumnName('transportCompanyId') })
  transportCompany: MTransportCompanyEntity;

  @OneToMany(() => MUserEntity, mUser => mUser.driver, {
    cascade: true,
  })
  mUsers: MUserEntity[];

  @OneToMany(() => TCourseEntity, tCourse => tCourse.driver, {
    cascade: true,
  })
  tCourses: TCourseEntity[];
}
