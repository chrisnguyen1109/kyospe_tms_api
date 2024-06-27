import { ValidationError } from 'class-validator';
import { upperFirst } from 'lodash';

export const handleClassValidatorErr = (errors: ValidationError[]): string => {
  return errors.reduce((prev, cur) => {
    if (cur.constraints) {
      const constraintsErrs = Object.values(cur.constraints).join(', ');

      return prev.concat(
        `[${upperFirst(cur.property)}]: `,
        constraintsErrs,
        '; ',
      );
    }

    return prev.concat(
      `[${upperFirst(cur.property)}]: `,
      `( ${handleClassValidatorErr(cur.children ?? [])} )`,
      '; ',
    );
  }, '');
};
