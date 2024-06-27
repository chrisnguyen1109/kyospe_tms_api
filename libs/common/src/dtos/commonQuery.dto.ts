import { IsNumber, IsOptional } from 'class-validator';
import { OrderBy } from '../types/common.type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../types/constant.type';
import { IsSortQuery } from '../validators/isSortQuery.validator';
import { ApiProperty } from '@nestjs/swagger';

export const CommonQueryDto = (sortFields: [string, ...string[]]) => {
  class QueryDto {
    @ApiProperty({ example: DEFAULT_PAGE, required: false })
    @IsNumber()
    @IsOptional()
    page: number = DEFAULT_PAGE;

    @ApiProperty({ example: DEFAULT_LIMIT, required: false })
    @IsNumber()
    @IsOptional()
    limit: number = DEFAULT_LIMIT;

    @ApiProperty({
      required: false,
      type: 'object',
      additionalProperties: {
        type: 'object',
      },
      example: { sort: { [sortFields[0]]: OrderBy.DESC } },
    })
    @IsSortQuery(sortFields)
    @IsOptional()
    sort: Record<string, OrderBy> = { [sortFields[0]]: OrderBy.DESC };
  }

  return QueryDto;
};
