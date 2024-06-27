import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsMapValueArrayNumber(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMapValueArrayNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: Map<any, any>) {
          for (const [, val] of value.entries()) {
            if (!Array.isArray(val)) {
              return false;
            }

            for (const item of val) {
              if (typeof item !== 'number' || Number.isNaN(item)) {
                return false;
              }
            }
          }

          return true;
        },
        defaultMessage() {
          return 'Typeof each item in value must be number';
        },
      },
    });
  };
}
