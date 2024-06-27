import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MCourseEntity } from './mCourse.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';

@Entity()
export class MCourseTripRelationshipEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: 'コーストリップ紐づけID' })
  courseTripId: number;

  @Column({ comment: 'コース枠ID' })
  courseId: number;

  @ManyToOne(() => MCourseEntity, mCourse => mCourse.mCourseTripRelationships, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('courseId') })
  course: MCourseEntity;

  @Column({
    nullable: true,
    comment: '運送会社ID',
  })
  transportCompanyId?: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportConpany => mTransportConpany.mCourseTripRelationships,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: formatColumnName('transportCompanyId') })
  transportCompany?: MTransportCompanyEntity;

  @Column({
    nullable: true,
    comment: '出発拠点住所1',
    length: 256,
  })
  startBaseAddress1?: string;

  @Column({
    nullable: true,
    comment: '出発拠点住所2',
    length: 256,
  })
  startBaseAddress2?: string;

  @Column({
    nullable: true,
    comment: '到着拠点住所1',
    length: 256,
  })
  arriveBaseAddress1?: string;

  @Column({
    nullable: true,
    comment: '到着拠点住所2',
    length: 256,
  })
  arriveBaseAddress2?: string;
}
