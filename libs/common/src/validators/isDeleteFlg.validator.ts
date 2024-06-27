import { applyDecorators } from '@nestjs/common';
import { IsInI18n } from './isInI18n.validator';
import { IsNotEmptyI18n } from './isNotEmptyI18n.validator';

export const IsDeleteFlg = () =>
  applyDecorators(
    IsInI18n([0, 1], { name: '削除フラグ' }),
    IsNotEmptyI18n({ name: '削除フラグ' }),
  );
