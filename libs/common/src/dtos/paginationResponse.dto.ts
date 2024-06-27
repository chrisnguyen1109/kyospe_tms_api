import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../types/constant.type';

export class PaginationResponseDto {
  @ApiProperty({ example: DEFAULT_PAGE })
  @Expose()
  page: number;

  @ApiProperty({ example: DEFAULT_LIMIT })
  @Expose()
  limit: number;

  @ApiProperty({ example: 1 })
  @Expose()
  count: number;

  @ApiProperty({ example: 1 })
  @Expose()
  totalCount: number;

  @ApiProperty({ example: 1 })
  @Expose()
  totalPage: number;
}
