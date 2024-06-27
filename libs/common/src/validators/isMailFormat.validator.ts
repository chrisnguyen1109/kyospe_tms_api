import { Matches } from 'class-validator';

export const IsMailFormat = (message: string = 'invalid email format') =>
  Matches(
    /^[a-zA-Z0-9&=_'\-+]+(\.[a-zA-Z0-9&=_'\-+]+)*@([a-zA-Z0-9&=_'\-+]+\.)+[a-zA-Z]{2,}$/,
    { message },
  );
