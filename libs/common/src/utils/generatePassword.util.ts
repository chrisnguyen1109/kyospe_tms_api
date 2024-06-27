import { generate } from 'generate-password';

export const generatePassword = () =>
  generate({
    length: 10,
    numbers: true,
    lowercase: true,
    uppercase: true,
    symbols: true,
    strict: true,
  });
