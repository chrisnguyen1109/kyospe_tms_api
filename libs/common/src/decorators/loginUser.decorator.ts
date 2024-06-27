import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { transformLoginUser } from '../utils/transformLoginUser.util';

export const LoginUser = createParamDecorator<
  keyof LoginUserDto,
  ExecutionContext,
  LoginUserDto | LoginUserDto[keyof LoginUserDto]
>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  const reqUser = request.user;
  if (!reqUser) {
    throw new UnauthorizedException();
  }

  const user = transformLoginUser(reqUser);

  if (data) return user[data];

  return user;
});
