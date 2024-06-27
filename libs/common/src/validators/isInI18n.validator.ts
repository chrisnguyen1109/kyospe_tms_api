import { I18nTranslations } from '@app/i18n/i18n.type';
import { IsIn } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsInI18n = (
  values: any[],
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsIn(values)
    : IsIn(values, {
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.IS_IN',
          { ...args, values: values.join(', ') },
        ),
      });
