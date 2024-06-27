import { ErrorCode } from '@app/common/types/common.type';
import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class TRN_CRS022_001Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.BAD_REQUEST, [{ code: ErrorCode.TRN_CRS022_001, detail }]);
  }
}
