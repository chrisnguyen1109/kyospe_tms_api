import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from './paginationResponse.dto';
import { ClassConstructor } from '../types/util.type';
import { ApiProperty } from '@nestjs/swagger';

export const ListResponseDto = (ResultResponseDto: ClassConstructor) => {
  class ListResponse {
    @ApiProperty({
      type: [ResultResponseDto],
    })
    @Expose()
    @Type(() => ResultResponseDto)
    results: (typeof ResultResponseDto)[];

    @ApiProperty({
      type: PaginationResponseDto,
    })
    @Expose()
    @Type(() => PaginationResponseDto)
    pagination: PaginationResponseDto;

    constructor(data: Record<string, any>) {
      Object.assign(this, data);
    }
  }

  return ListResponse;
};
