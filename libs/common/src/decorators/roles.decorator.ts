import { SetMetadata } from '@nestjs/common';
import { MetadataKey } from '../types/common.type';
import { RoleDiv } from '../types/div.type';

export const Roles = (...roles: RoleDiv[]) =>
  SetMetadata(MetadataKey.ROLES_KEY, roles);
