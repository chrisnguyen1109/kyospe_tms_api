import AsyncLock, { AsyncLockDoneCallback } from 'async-lock';
import { LockKey } from '../types/common.type';

export class AsyncLockService extends AsyncLock {
  acquireImportMBase<T extends Array<void>>(
    handler: () => Promise<T>,
    cb?: AsyncLockDoneCallback<T>,
  ) {
    return this.acquireJob(LockKey.IMPORT_BASE, handler, cb);
  }

  acquireImportSlip<T extends Array<void>>(
    handler: () => Promise<T>,
    cb?: AsyncLockDoneCallback<T>,
  ) {
    return this.acquireJob(LockKey.IMPORT_IF, handler, cb);
  }

  private acquireJob<T = any>(
    lockKey: LockKey,
    handler: () => T | Promise<T>,
    cb?: AsyncLockDoneCallback<T>,
  ) {
    return this.acquire<T>(
      lockKey,
      async done => {
        try {
          const data = await handler();

          done(null, data);
        } catch (error) {
          done(<Error>error);
        }
      },
      (error, ret) => cb?.(error, ret),
    );
  }
}
