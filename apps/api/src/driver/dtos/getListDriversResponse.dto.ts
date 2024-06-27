import { ListResponseDto } from '@app/common/dtos/listResponse.dto';
import { DriverResponseDto } from './driverResponse.dto';

export class GetListDriversResponseDto extends ListResponseDto(
  DriverResponseDto,
) {}
