import { I18nTranslations } from '@app/i18n/i18n.type';
import { IsNumberString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsNumberStringI18n = (
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsNumberString()
    : IsNumberString(
        {},
        {
          message: i18nValidationMessage<I18nTranslations>(
            'errorMessage.if.IS_NUMBER',
            args,
          ),
        },
      );
