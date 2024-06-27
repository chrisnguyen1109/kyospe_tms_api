import {
  ValidationOptions,
  isObject,
  registerDecorator,
} from 'class-validator';
import { OrderBy } from '../types/common.type';
import { applyDecorators } from '@nestjs/common';
import { IsInObjectKey } from './isInObjectKey.validator';

function IsSortQueryFormat(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSortQueryFormat',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isObject(value)) {
            return false;
          }

          return Object.values(value).every(direction => {
            return direction === OrderBy.ASC || direction === OrderBy.DESC;
          });
        },
        defaultMessage() {
          return 'Invalid sort query format';
        },
      },
    });
  };
}

export const IsSortQuery = (sortFields: string[]) =>
  applyDecorators(
    <PropertyDecorator>IsSortQueryFormat(),
    <PropertyDecorator>IsInObjectKey(sortFields),
  );
