import { PickType } from '@nestjs/swagger';
import { UpdateWorkStatusNoSignBodyDto } from './updateWorkStatusNoSignBody.dto';

export class UpdateWorkStatusSignBodyDto extends PickType(
  UpdateWorkStatusNoSignBodyDto,
  ['statusDiv'] as const,
) {}
