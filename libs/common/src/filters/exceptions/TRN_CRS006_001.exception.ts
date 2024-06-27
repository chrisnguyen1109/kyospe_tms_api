import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCode } from '@app/common/types/common.type';

export class TRN_CRS006_001Exception extends CustomException {
  constructor(detail?: any) {
    super(HttpStatus.FORBIDDEN, [{ code: ErrorCode.TRN_CRS006_001, detail }]);
  }
}
