import { PaginationResponseDto } from '../dtos/paginationResponse.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../types/constant.type';

export const getPagination = (
  count: number,
  totalCount: number,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
): PaginationResponseDto => {
  return {
    page,
    limit,
    count,
    totalCount,
    totalPage: Math.ceil(totalCount / limit),
  };
};
