import { applyDecorators, UseGuards } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

export const UseThrottle = (limit?: number, ttl?: number) =>
  applyDecorators(Throttle(limit, ttl), UseGuards(ThrottlerGuard));
