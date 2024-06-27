import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsMapPropertyNumber(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMapPropertyNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: Map<any, any>) {
          for (const [key] of value.entries()) {
            if (typeof key !== 'number' || Number.isNaN(key)) {
              return false;
            }
          }

          return true;
        },
        defaultMessage() {
          return 'Typeof key must be number';
        },
      },
    });
  };
}
