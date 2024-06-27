import { ValidationOptions, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { handleClassValidatorErr } from './handleClassValidatorErr.util';
import { ClassConstructor } from '../types/util.type';

export const validateConfig = <
  T extends Record<string, any>,
  K extends ClassConstructor,
>(
  config: T,
  schema: K,
  validationOptions: ValidationOptions = {},
) => {
  const configInstance = plainToInstance<InstanceType<K>, T>(schema, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(configInstance, {
    skipMissingProperties: false,
    ...validationOptions,
  });

  if (errors.length) {
    const errorMessage = handleClassValidatorErr(errors);

    throw new Error(errorMessage);
  }

  return configInstance;
};
