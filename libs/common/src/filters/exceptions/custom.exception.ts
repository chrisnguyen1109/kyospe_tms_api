import { CustomError } from '@app/common/types/common.type';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    public readonly statusCode: HttpStatus,
    public readonly errors: CustomError[],
  ) {
    super('Error', statusCode);
  }
}
