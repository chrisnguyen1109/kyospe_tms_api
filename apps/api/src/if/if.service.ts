import { IF_MST001_001Exception } from '@app/common/filters/exceptions/IF_MST001_001.exception';
import { IF_REQ001_001Exception } from '@app/common/filters/exceptions/IF_REQ001_001.exception';
import {
  AppEventPattern,
  AppMessagePattern,
  AppService,
} from '@app/common/types/common.type';
import { ClassConstructor, ValueOf } from '@app/common/types/util.type';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

export class IfService {
  constructor(
    @Inject(AppService.BATCH_SERVICE) private readonly client: ClientProxy,
  ) {}

  importMBase() {
    return this.importIfData(
      AppMessagePattern.Batch.IMPORT_BASE,
      IF_MST001_001Exception,
    );
  }

  importSlip() {
    return this.importIfData(
      AppMessagePattern.Batch.IMPORT_SLIP,
      IF_REQ001_001Exception,
    );
  }

  exportSign() {
    return this.client
      .emit(AppEventPattern.Batch.EXPORT_SIGN, {})
      .pipe(map(() => null));
  }

  private importIfData(
    pattern: ValueOf<typeof AppMessagePattern.Batch>,
    Exception: ClassConstructor = Error,
  ) {
    return this.client.send<boolean>(pattern, {}).pipe(
      map(data => {
        if (data) return null;

        throw new Exception(
          'Schedule mode is running so it cannot be executed',
        );
      }),
    );
  }
}
