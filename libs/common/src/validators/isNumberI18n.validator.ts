import { I18nTranslations } from '@app/i18n/i18n.type';
import { IsNumber, IsNumberOptions } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsNumberI18n = (
  options?: IsNumberOptions,
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsNumber(options)
    : IsNumber(options, {
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.IS_NUMBER',
          args,
        ),
      });
