import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function MaxNumberLength(
  max: number,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxNumberLength',
      target: object.constructor,
      propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [max] = args.constraints;

          return typeof value === 'number' && value.toString().length <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const [max] = args.constraints;

          return `${propertyName} must be shorter than or equal to ${max} characters`;
        },
      },
    });
  };
}
