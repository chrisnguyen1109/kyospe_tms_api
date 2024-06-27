import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(protected override readonly reflector: Reflector) {
    super(reflector, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }
}
