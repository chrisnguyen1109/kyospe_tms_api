import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class IF_REQ001_001Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.BAD_REQUEST, [{ code: ErrorCode.IF_REQ001_001, detail }]);
  }
}
