import { PickType } from '@nestjs/swagger';
import { CreateCourseBodyDto } from './createCourseBody.dto';

export class AssignCarAndDriverParamDto extends PickType(CreateCourseBodyDto, [
  'courseId',
  'serviceYmd',
] as const) {}
