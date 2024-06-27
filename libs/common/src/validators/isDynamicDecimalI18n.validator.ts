import { I18nTranslations } from '@app/i18n/i18n.type';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsDynamicDecimal } from './isDynamicDecimal.validator';

export const IsDynamicDecimalI18n = (
  precision: string,
  scale: string,
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsDynamicDecimal(precision, scale)
    : IsDynamicDecimal(precision, scale, {
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.IS_DYNAMIC_DECIMAL',
          { ...args, precision, scale },
        ),
      });
