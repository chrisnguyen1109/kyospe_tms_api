import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class COM_CER001_001Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.UNAUTHORIZED, [
      { code: ErrorCode.COM_CER001_001, detail },
    ]);
  }
}
