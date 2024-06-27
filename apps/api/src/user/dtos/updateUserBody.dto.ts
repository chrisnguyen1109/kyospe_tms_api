import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateUserBodyDto } from './createUserBody.dto';

export class UpdateUserBodyDto extends PartialType(
  PickType(CreateUserBodyDto, [
    'userNm',
    'userNmKn',
    'mainBaseId',
    'driverId',
  ] as const),
) {
  @ApiProperty({ required: false, example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  transportCompanyId?: number;
}
