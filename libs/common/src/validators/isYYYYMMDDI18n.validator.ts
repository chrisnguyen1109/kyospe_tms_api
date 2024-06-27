import { I18nTranslations } from '@app/i18n/i18n.type';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';
import moment from 'moment';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsYYYYMMDDI18n = (
  format?: string,
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  applyDecorators(
    useDefault
      ? IsDateString()
      : IsDateString(
          {},
          {
            message: i18nValidationMessage<I18nTranslations>(
              'errorMessage.if.IS_YYYYMMDD',
              args,
            ),
          },
        ),
    Transform(
      ({ value }) => value && moment(value, format, true).format('YYYY-MM-DD'),
    ),
  );
