import { ListResponseDto } from '@app/common/dtos/listResponse.dto';
import { TransportCompanyResponseDto } from './transportCompanyResponse.dto';

export class GetListTransportCompanyResponseDto extends ListResponseDto(
  TransportCompanyResponseDto,
) {}
