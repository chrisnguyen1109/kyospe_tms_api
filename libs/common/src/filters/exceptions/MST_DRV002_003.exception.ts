import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class MST_DRV002_003Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.BAD_REQUEST, [{ code: ErrorCode.MST_DRV002_003, detail }]);
  }
}
