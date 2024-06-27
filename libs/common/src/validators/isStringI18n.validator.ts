import { I18nTranslations } from '@app/i18n/i18n.type';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsStringI18n = (
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsString()
    : IsString({
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.IS_STRING',
          args,
        ),
      });
