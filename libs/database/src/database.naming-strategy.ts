import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'lodash';

export class DatabaseNamingStrategy extends DefaultNamingStrategy {
  private static instance: DatabaseNamingStrategy;

  private constructor() {
    super();
  }

  static getInstance(): DatabaseNamingStrategy {
    if (!DatabaseNamingStrategy.instance) {
      this.instance = new DatabaseNamingStrategy();
    }

    return this.instance;
  }

  override tableName(targetName: string, userSpecifiedName?: string): string {
    return (
      userSpecifiedName ??
      snakeCase(targetName.replace('Entity', '')).toUpperCase()
    );
  }

  override columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      (customName ?? propertyName).concat(' ', embeddedPrefixes.join(' ')),
    ).toUpperCase();
  }
}
