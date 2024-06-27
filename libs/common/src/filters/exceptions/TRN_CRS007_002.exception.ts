import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class TRN_CRS007_002Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.FORBIDDEN, [{ code: ErrorCode.TRN_CRS007_002, detail }]);
  }
}
