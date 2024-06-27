import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ClassConstructor } from '../types/util.type';

export const ApiMultipartFormData = (ClassDto: ClassConstructor) =>
  applyDecorators(
    ApiBody({
      type: ClassDto,
    }),
    ApiConsumes('multipart/form-data'),
  );
