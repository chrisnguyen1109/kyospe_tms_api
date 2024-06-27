import { I18nTranslations } from '@app/i18n/i18n.type';
import { i18nValidationMessage } from 'nestjs-i18n';
import { MaxNumberLength } from './maxNumberLength.validator';

export const MaxNumberLengthI18n = (
  max: number,
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? MaxNumberLength(max)
    : MaxNumberLength(max, {
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.MAX_LENGTH',
          args,
        ),
      });
