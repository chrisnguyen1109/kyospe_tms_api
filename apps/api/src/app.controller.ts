import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { RoutePublic } from '@app/common/decorators/routePublic.decorator';
import { ErrorResponseDto } from '@app/common/dtos/errorResponse.dto';
import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiInternalServerErrorResponse({ type: ErrorResponseDto })
  @ApiSuccessResponse({ example: 'OK' })
  @RoutePublic()
  @Get('/health')
  hello() {
    return 'OK';
  }
}
