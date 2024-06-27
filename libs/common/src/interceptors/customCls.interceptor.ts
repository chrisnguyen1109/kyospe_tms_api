import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomClsService } from '../services/customCls.service';

@Injectable()
export class CustomClsInterceptor implements NestInterceptor {
  constructor(private readonly clsService: CustomClsService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();

    this.clsService.set('user', request.user);
    this.clsService.set('ip', request.ip);

    return next.handle();
  }
}
