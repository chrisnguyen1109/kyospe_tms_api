import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTransportCompanyBodyDto } from './createTransportCompanyBody.dto';

export class UpdateTransportCompanyBodyDto extends PartialType(
  OmitType(CreateTransportCompanyBodyDto, ['parentCompanyId'] as const),
) {}
