import { MetadataKey } from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      RoleDiv[] | undefined
    >(MetadataKey.ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest<Request>().user;
    if (!user) {
      throw new UnauthorizedException();
    }

    return requiredRoles.includes(user.roleDiv);
  }
}
