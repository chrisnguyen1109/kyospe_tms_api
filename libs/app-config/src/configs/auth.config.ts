import { registerAs } from '@nestjs/config';
import { AuthConfigDto } from './dtos/authConfig.dto';
import { validateConfig } from '@app/common/utils/validateConfig.util';

export const authConfig = registerAs('auth', () =>
  validateConfig(
    {
      atPrivateKey: process.env['AT_PRIVATE_KEY']?.replace(/\\n/gm, '\n'),
      atPublicKey: process.env['AT_PUBLIC_KEY']?.replace(/\\n/gm, '\n'),
      atExpire: process.env['AT_EXPIRE'],
      rtPrivateKey: process.env['RT_PRIVATE_KEY']?.replace(/\\n/gm, '\n'),
      rtPublicKey: process.env['RT_PUBLIC_KEY']?.replace(/\\n/gm, '\n'),
      rtExpire: process.env['RT_EXPIRE'],
    },
    AuthConfigDto,
  ),
);
