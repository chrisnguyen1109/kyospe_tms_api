import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';
import moment from 'moment';

export const IsYYYYMMDD = (format?: string) =>
  applyDecorators(
    IsDateString(),
    Transform(
      ({ value }) => value && moment(value, format, true).format('YYYY-MM-DD'),
    ),
  );
