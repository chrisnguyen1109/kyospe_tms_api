import { PickType } from '@nestjs/swagger';
import { CreateCourseBodyDto } from './createCourseBody.dto';

export class CreateCourseFrameBodyDto extends PickType(CreateCourseBodyDto, [
  'courseId',
  'serviceYmd',
] as const) {}
