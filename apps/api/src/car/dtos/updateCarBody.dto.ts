import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCarBodyDto } from './createCarBody.dto';

export class UpdateCarBodyDto extends PartialType(
  OmitType(CreateCarBodyDto, ['owningCompanyId'] as const),
) {}
