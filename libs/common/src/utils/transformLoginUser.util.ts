import { plainToInstance } from 'class-transformer';
import { LoginUserDto } from '../dtos/loginUser.dto';

export const transformLoginUser = (user: LoginUserDto) =>
  plainToInstance(LoginUserDto, user, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
