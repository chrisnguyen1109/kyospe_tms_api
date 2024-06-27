import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsInObjectKey(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInObjectKey',
      target: object.constructor,
      propertyName,
      constraints: [...fields],
      options: validationOptions,
      validator: {
        validate(value: object, args: ValidationArguments) {
          return Object.keys(value).every(field =>
            args.constraints.includes(field),
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `Key must be one of following values: ${args.constraints.join(
            ', ',
          )}`;
        },
      },
    });
  };
}
