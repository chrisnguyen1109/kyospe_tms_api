/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv').config();
require('dotenv-expand').expand(dotenv);

module.exports = {
  type: process.env['DATABASE_TYPE'],
  host: process.env['DATABASE_HOST'],
  port: process.env['DATABASE_PORT'],
  username: process.env['DATABASE_USERNAME'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  entities: ['libs/database/src/entities/**/*.{ts,js}'],
  seeds: ['libs/database/src/seeds/**/*{.ts,.js}'],
};
