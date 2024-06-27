import { parse, transform } from 'csv';
import { Options } from 'csv-parse';
import { omit } from 'lodash';
import fs from 'node:fs';
import path from 'node:path';
import { SEEDING_START_LINE } from '../types/constant.type';

const commonColumns = [
  'REGI_PG_ID',
  'REGI_DATETIME',
  'REGI_USER_ID',
  'REGI_TERMINAL_IP_ADDR',
  'UPD_PG_ID',
  'UPD_DATETIME',
  'UPD_USER_ID',
  'UPD_TERMINAL_IP_ADDR',
];

export const loadSeedingData = <T extends Record<string, string>>(
  columns: string[],
  fileName: string,
  options: Options & { skipColumns: string[] } = { skipColumns: [] },
) => {
  const filePath = path.join(
    process.cwd(),
    `./libs/database/src/seeds/${process.env['NODE_ENV']}/${fileName}.csv`,
  );

  return new Promise<T[]>((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: ['物理名', ...columns, ...commonColumns],
          fromLine: SEEDING_START_LINE,
          skipEmptyLines: true,
          skipRecordsWithEmptyValues: true,
          cast: value => value || null,
          ...options,
        }),
      )
      .pipe(
        transform(
          record => omit(record, ['物理名', ...options.skipColumns]),
          (error, data) => {
            if (error) {
              rej(error);
            }

            res(data as unknown as T[]);
          },
        ),
      );
  });
};
