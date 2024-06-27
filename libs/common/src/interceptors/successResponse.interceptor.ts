import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs';

export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => {
        if (data instanceof StreamableFile) {
          return data;
        }

        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        return {
          statusCode: res.statusCode || HttpStatus.OK,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
