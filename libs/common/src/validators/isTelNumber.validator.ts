import { Matches } from 'class-validator';

export const IsTelNumber = (message: string = 'invalid phone number') =>
  Matches(/^[-\d]{0,13}$/, { message });
