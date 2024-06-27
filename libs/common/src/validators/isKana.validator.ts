import { Matches } from 'class-validator';

export const IsKana = (message: string = 'invalid kana characters') =>
  Matches(/^([ぁ-ん\s]|ー)*$/, { message });
