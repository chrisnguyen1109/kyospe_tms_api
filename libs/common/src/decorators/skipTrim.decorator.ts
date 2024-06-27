import { SetMetadata } from '@nestjs/common';
import { MetadataKey } from '../types/common.type';
import { ClassConstructor } from '../types/util.type';

export const SkipTrim = <T extends ClassConstructor>(
  ...fields: (keyof InstanceType<T>)[]
) => SetMetadata(MetadataKey.SKIP_TRIM_KEY, fields);
