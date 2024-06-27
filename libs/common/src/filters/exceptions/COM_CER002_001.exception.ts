import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class COM_CER002_001Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.NOT_FOUND, [{ code: ErrorCode.COM_CER002_001, detail }]);
  }
}
