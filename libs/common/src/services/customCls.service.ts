import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { ClsService, ClsStore, Terminal } from 'nestjs-cls';

export interface CustomClsStore extends ClsStore {
  user?: Terminal<LoginUserDto>;
  ip: string;
}

export class CustomClsService extends ClsService<CustomClsStore> {}
