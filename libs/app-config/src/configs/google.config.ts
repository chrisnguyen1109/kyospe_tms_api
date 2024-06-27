import { validateConfig } from '@app/common/utils/validateConfig.util';
import { registerAs } from '@nestjs/config';
import { GoogleConfigDto } from './dtos/googleConfig.dto';

export const googleConfig = registerAs('google', () =>
  validateConfig(
    {
      apiUrl: process.env['GOOGLE_API_URL'],
      apiKey: process.env['GOOGLE_API_KEY'],
    },
    GoogleConfigDto,
  ),
);
