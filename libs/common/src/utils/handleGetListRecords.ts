import { SelectQueryBuilder } from 'typeorm';
import { OrderBy, ParameterSearchMappings } from '../types/common.type';
import { getPagination } from './getPagination.util';

export const escapeLikeString = (raw: string): string => {
  return raw.replace(/[\\%_]/g, '\\$&');
};

export const handleGetListRecords = async (
  queryBuilder: SelectQueryBuilder<any>,
  parameterMappings: ParameterSearchMappings[],
  sort: Record<string, OrderBy>,
  limit: number,
  page: number,
) => {
  const skip = (page - 1) * limit;

  const searchQueryBuilder = searchQueryParams(queryBuilder, parameterMappings);
  const sortQueryBuilder = sortQueryParams(searchQueryBuilder, sort);

  const totalCount = await sortQueryBuilder.getCount();
  sortQueryBuilder.limit(limit).offset(skip);

  const results = await sortQueryBuilder.getRawMany();

  return {
    results,
    pagination: getPagination(results.length, totalCount, page, limit),
  };
};

export const searchQueryParams = (
  queryBuilder: SelectQueryBuilder<any>,
  parameterMappings: ParameterSearchMappings[],
): SelectQueryBuilder<any> => {
  for (const mapping of parameterMappings) {
    const { queryParam, field, operator, pattern, value } = mapping;
    if (pattern || value) {
      if (operator === 'IN') {
        queryBuilder.andWhere(`${field} IN (:...${queryParam})`, {
          [queryParam]: value,
        });
      } else {
        const paramValue = pattern ? `%${escapeLikeString(pattern)}%` : value;
        queryBuilder.andWhere(`${field} ${operator} :${queryParam}`, {
          [queryParam]: paramValue,
        });
      }
    }
  }

  return queryBuilder;
};

export const sortQueryParams = (
  queryBuilder: SelectQueryBuilder<any>,
  sort: Record<string, OrderBy>,
): SelectQueryBuilder<any> => {
  for (const key of Object.keys(sort)) {
    queryBuilder.addOrderBy(key, sort[key]);
  }

  return queryBuilder;
};
