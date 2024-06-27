import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export abstract class BaseTransaction<T, K> {
  constructor(protected readonly dataSource: DataSource) {}

  abstract execute(
    data: T,
    manager: EntityManager,
    ...params: any[]
  ): Promise<K>;

  async run(data: T, ...params: any[]): Promise<K> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.execute(data, queryRunner.manager, ...params);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async runWithinTransaction(data: T, manager: EntityManager): Promise<K> {
    return this.execute(data, manager);
  }
}
