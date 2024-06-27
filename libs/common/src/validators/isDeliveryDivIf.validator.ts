import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnumI18n } from './isEnumI18n.validator';
import { DeliveryDiv } from '../types/div.type';

export const IsDeliveryDivIf = () =>
  applyDecorators(
    IsEnumI18n(DeliveryDiv, { name: '配送区分' }),
    Transform(({ value }) => (<string>value).padStart(2, '0')),
  );
