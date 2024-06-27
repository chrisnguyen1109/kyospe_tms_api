import { registerAs } from '@nestjs/config';
import { MailConfigDto } from './dtos/mailConfig.dto';
import { validateConfig } from '@app/common/utils/validateConfig.util';

export const mailConfig = registerAs('mail', () =>
  validateConfig(
    {
      connectionString: process.env['MAIL_CONNECTION_STRING'],
      from: process.env['MAIL_FROM'],
    },
    MailConfigDto,
  ),
);
