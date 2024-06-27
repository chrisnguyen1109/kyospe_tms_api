import { DataSource, DataSourceOptions } from 'typeorm';
import ormconfig from '../../../ormconfig.js';
import { DatabaseNamingStrategy } from './database.naming-strategy';

export default new DataSource({
  ...ormconfig,
  migrations: ['libs/database/src/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'MIGRATIONS',
  namingStrategy: DatabaseNamingStrategy.getInstance(),
} as DataSourceOptions);
