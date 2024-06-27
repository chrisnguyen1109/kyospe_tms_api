import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const SessionId = createParamDecorator<never, ExecutionContext, string>(
  (_, ctx) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const sessionId = request.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException();
    }

    return sessionId;
  },
);
