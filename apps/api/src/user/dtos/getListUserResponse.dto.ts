import { ListResponseDto } from '@app/common/dtos/listResponse.dto';
import { UserResponseDto } from './userResponse.dto';
import { OmitType } from '@nestjs/swagger';

export class GetListUserResponseDto extends ListResponseDto(
  OmitType(UserResponseDto, ['driverNm'] as const),
) {}
