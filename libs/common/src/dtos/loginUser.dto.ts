import { Expose } from 'class-transformer';
import { RoleDiv } from '../types/div.type';

export class LoginUserDto {
  @Expose()
  mUserId: number;

  @Expose()
  userId: string;

  @Expose()
  userNm: string;

  @Expose()
  userNmKn: string;

  @Expose()
  mailAddress?: string;

  @Expose()
  roleDiv: RoleDiv;

  @Expose()
  mainBaseId?: number;

  @Expose()
  transportCompanyId?: number;

  @Expose()
  driverId?: number;
}
