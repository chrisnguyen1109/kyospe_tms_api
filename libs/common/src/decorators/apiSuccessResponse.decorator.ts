import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ClassConstructor } from '../types/util.type';
import { SuccessResponseDto } from '../dtos/successResponse.dto';

export const ApiSuccessResponse = <T extends ClassConstructor>({
  model,
  example,
  statusCode,
  isArray = false,
}: {
  model?: T;
  example?: any;
  statusCode?: HttpStatus;
  isArray?: boolean;
}) => {
  const extraModel: ClassConstructor[] = model
    ? [SuccessResponseDto, model]
    : [SuccessResponseDto];

  let data: Record<string, any>;

  if (model) {
    data = isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : { $ref: getSchemaPath(model) };
  } else {
    data = { example };
  }

  return applyDecorators(
    ApiExtraModels(...extraModel),
    ApiResponse({
      status: statusCode ?? HttpStatus.OK,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data,
            },
          },
        ],
      },
    }),
  );
};
