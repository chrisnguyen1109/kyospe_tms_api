import { omitBy, isUndefined } from 'lodash';

export const omitUndefined = <T = any>(obj: Record<string, any>) =>
  omitBy(obj, isUndefined) as T;
