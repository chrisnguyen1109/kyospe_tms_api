import { InferSubjects } from '@casl/ability';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';

export type ClassConstructor<T = any> = {
  new (...args: any[]): T;
};

export type Subjects<T extends ClassConstructor> = InferSubjects<T> | 'all';

export type ValueOf<T> = T[keyof T];

export type ArrayElement<T extends Array<unknown>> = T extends Array<infer R>
  ? R
  : never;

export type FindOneByParams<T extends ObjectLiteral> =
  | FindOptionsWhere<T>
  | FindOptionsWhere<T>[];
