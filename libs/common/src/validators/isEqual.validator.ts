import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEqual(
  matchValue: any,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName,
      constraints: [matchValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [matchValue] = args.constraints;

          return value === matchValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [matchValue] = args.constraints;

          return `${propertyName} must equal to ${matchValue}`;
        },
      },
    });
  };
}
