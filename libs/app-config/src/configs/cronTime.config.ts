import { validateConfig } from '@app/common/utils/validateConfig.util';
import { registerAs } from '@nestjs/config';
import { CronTimeConfigDto } from './dtos/cronTimeConfig.dto';

export const cronTimeConfig = registerAs('cronTime', () =>
  validateConfig(
    {
      connectSlipCronTime: process.env['CONNECT_SLIP_CRON_TIME'],
      connectMasterCronTime: process.env['CONNECT_MASTER_CRON_TIME'],
      connectSignCronTime: process.env['CONNECT_SIGN_CRON_TIME'],
      autoCreatCourseCronTime: process.env['AUTO_CREATE_COURSE_CRON_TIME'],
      confirmActualDataCronTime: process.env['CONFIRM_ACTUAL_DATA_CRON_TIME'],
      removeSessionCronTime: process.env['REMOVE_SESSION_CRON_TIME'],
    },
    CronTimeConfigDto,
  ),
);
