import { I18nTranslations } from '@app/i18n/i18n.type';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsNotEmptyI18n = (
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsNotEmpty()
    : IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.IS_NOT_EMPTY',
          args,
        ),
      });
