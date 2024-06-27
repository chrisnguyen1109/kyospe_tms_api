import { I18nTranslations } from '@app/i18n/i18n.type';
import { IsEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IsEnumI18n = (
  entity: object,
  args?: Record<string, any>,
  useDefault: boolean = false,
) =>
  useDefault
    ? IsEnum(entity)
    : IsEnum(entity, {
        message: i18nValidationMessage<I18nTranslations>(
          'errorMessage.if.IS_ENUM',
          { ...args, enum: Object.values(entity).join(', ') },
        ),
      });
