import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isObject } from 'lodash';
import { MetadataKey } from '../types/common.type';

@Injectable()
export class TrimPipe implements PipeTransform {
  constructor(private readonly reflector: Reflector) {}

  transform(data: any, metadata: ArgumentMetadata) {
    const skipFields =
      metadata.metatype &&
      this.reflector.get<string[] | undefined>(
        MetadataKey.SKIP_TRIM_KEY,
        metadata.metatype,
      );

    if (isObject(data) && metadata.type === 'body') {
      Object.entries(data).forEach(([key, value]) => {
        if (!skipFields?.includes(key) && value && typeof value === 'string') {
          (data as Record<string, string>)[key] = value.trim();
        }
      });

      return data;
    }

    return data;
  }
}
