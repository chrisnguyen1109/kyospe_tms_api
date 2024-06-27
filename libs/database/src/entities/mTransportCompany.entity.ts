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
import { MBaseEntity } from './mBase.entity';
import { MCarEntity } from './mCar.entity';
import { MCngTransportCompanyEntity } from './mCngTransportCompany.entity';
import { MCourseEntity } from './mCourse.entity';
import { MDriverEntity } from './mDriver.entity';
import { MUserEntity } from './mUser.entity';
import { TCourseEntity } from './tCourse.entity';
import { MCourseTripRelationshipEntity } from './mCourseTripRelationship.entity';

@Entity()
export class MTransportCompanyEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: '運送会社ID' })
  transportCompanyId: number;

  @Column({
    comment: '運送会社名称',
    length: 128,
  })
  transportCompanyNm: string;

  @Column({
    nullable: true,
    comment: '電話番号',
    length: 15,
  })
  telNumber?: string;

  @Column({
    nullable: true,
    comment: '親会社ID:庸車の場合、親となる運送会社IDを設定する。',
  })
  parentCompanyId?: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.mTransportCompanies,
    { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true },
  )
  @JoinColumn({ name: formatColumnName('parentCompanyId') })
  parentCompany?: MTransportCompanyEntity;

  @OneToMany(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.parentCompany,
    { cascade: true },
  )
  mTransportCompanies: MTransportCompanyEntity[];

  @Column({
    nullable: true,
    comment:
      '庸車拠点ID:庸車の場合、業者がセンターに紐づいている。\r\n同じ会社が複数のセンターに紐づく場合もある。',
  })
  carriageBaseId?: number;

  @ManyToOne(() => MBaseEntity, mBase => mBase.mTransportCompanies, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('carriageBaseId') })
  carriageBase?: MBaseEntity;

  @OneToMany(() => MUserEntity, mUser => mUser.transportCompany, {
    cascade: true,
  })
  mUsers: MUserEntity[];

  @OneToMany(() => MDriverEntity, mDriver => mDriver.transportCompany, {
    cascade: true,
  })
  mDrivers: MDriverEntity[];

  @OneToMany(() => MCarEntity, mCar => mCar.owningCompany, { cascade: true })
  mCars: MCarEntity[];

  @OneToMany(() => MCourseEntity, mCourse => mCourse.transportCompany, {
    cascade: true,
  })
  mCourses: MCourseEntity[];

  @OneToMany(
    () => MCourseTripRelationshipEntity,
    mCourseTripRelationship => mCourseTripRelationship.transportCompany,
    { cascade: true },
  )
  mCourseTripRelationships: MCourseTripRelationshipEntity[];

  @OneToMany(() => TCourseEntity, tCourse => tCourse.transportCompany, {
    cascade: true,
  })
  tCourses: TCourseEntity[];

  @OneToMany(
    () => MCngTransportCompanyEntity,
    mCngTransportCompany => mCngTransportCompany.transportCompany,
    {
      cascade: true,
    },
  )
  mCngTransportCompanies: MCngTransportCompanyEntity[];
}
