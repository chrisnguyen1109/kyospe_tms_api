import { SetMetadata } from '@nestjs/common';
import { MetadataKey } from '../types/common.type';

export const RoutePublic = () =>
  SetMetadata(MetadataKey.ROUTE_PUBLIC_KEY, true);
