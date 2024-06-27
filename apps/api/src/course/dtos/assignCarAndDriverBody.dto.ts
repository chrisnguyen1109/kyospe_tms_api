import { PickType } from '@nestjs/swagger';
import { CreateCourseBodyDto } from './createCourseBody.dto';

export class AssignCarAndDriverBodyDto extends PickType(CreateCourseBodyDto, [
  'carId',
  'driverId',
] as const) {}
