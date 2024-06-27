import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';

@Entity()
export class MCngTransportCompanyEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: '運送会社変換ID' })
  cngTransportCompanyId: number;

  @Column({
    unique: true,
    length: 2,
    comment: '配送業者CD',
  })
  companyCd: string;

  @Column({
    comment: '運送会社ID',
  })
  transportCompanyId: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.mCngTransportCompanies,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: formatColumnName('transportCompanyId') })
  transportCompany: MTransportCompanyEntity;

  @Column({
    default: false,
    comment: '架台フラグ',
  })
  kadaiFlg: boolean;
}
