import { ListResponseDto } from '@app/common/dtos/listResponse.dto';
import { SlipResponseDto } from './slipResponse.dto';

export class GetListSlipsResponseDto extends ListResponseDto(SlipResponseDto) {}
