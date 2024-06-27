import { ListResponseDto } from '@app/common/dtos/listResponse.dto';
import { CarResponseDto } from './carResponse.dto';

export class GetListCarsResponseDto extends ListResponseDto(CarResponseDto) {}
