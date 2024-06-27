import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsDynamicDecimal(
  precision: string,
  scale: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isDynamicDecimal',
      target: object.constructor,
      propertyName,
      constraints: [precision, scale],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [precision, scale] = args.constraints;
          const decimalRegex = new RegExp(
            `^-?\\d{1,${precision - scale}}(\\.\\d{1,${scale}})?$`,
          );

          return decimalRegex.test(value);
        },

        defaultMessage(args: ValidationArguments) {
          const [precision, scale] = args.constraints;

          return `Invalid decimal format (${precision},${scale})`;
        },
      },
    });
  };
}
