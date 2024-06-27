import { snakeCase } from 'lodash';

export const formatColumnName = (name: string) => snakeCase(name).toUpperCase();
