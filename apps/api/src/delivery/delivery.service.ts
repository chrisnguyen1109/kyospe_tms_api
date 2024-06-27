import { AppEventPattern, AppService } from '@app/common/types/common.type';
import { ValueOf } from '@app/common/types/util.type';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

export class DeliveryService {
  constructor(
    @Inject(AppService.BATCH_SERVICE) private readonly client: ClientProxy,
  ) {}

  confirmActualData() {
    return this.emitBatch(AppEventPattern.Batch.CONFIRM_ACTUAL);
  }

  assignCourse() {
    return this.emitBatch(AppEventPattern.Batch.ASSIGN_COURSE);
  }

  private emitBatch(pattern: ValueOf<typeof AppEventPattern.Batch>) {
    return this.client.emit(pattern, {}).pipe(map(() => null));
  }
}
