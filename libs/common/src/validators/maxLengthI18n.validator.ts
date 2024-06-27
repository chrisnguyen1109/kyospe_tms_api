import { I18nTranslations } from '@app/i18n/i18n.type';
import { MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const MaxLengthI18n = (
  max: number,
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? MaxLength(max)
    : MaxLength(max, {
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.MAX_LENGTH',
          args,
        ),
      });
