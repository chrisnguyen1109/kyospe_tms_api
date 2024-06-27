import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class TRN_CRS014_001Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.BAD_REQUEST, [{ code: ErrorCode.TRN_CRS014_001, detail }]);
  }
}
