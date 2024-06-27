import { IsMapPropertyNumber } from '@app/common/validators/isMapPropertyNumber.validator';
import { IsMapValueArrayNumber } from '@app/common/validators/isMapValueArrayNumber.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty } from 'class-validator';

export class AssignSpotsToCoursesBodyDto {
  @ApiProperty({
    required: true,
    example: { 1: [1, 2] },
  })
  @ArrayMinSize(1, { each: true })
  @IsMapValueArrayNumber()
  @IsMapPropertyNumber()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const map = new Map<number, number[]>();

    (<Map<string, any[]>>value).forEach((val, key) => map.set(+key, val));

    return map;
  })
  courseList: Map<number, number[]>;
}
