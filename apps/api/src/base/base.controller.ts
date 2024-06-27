import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseService } from './base.service';
import { UpdateBaseMemoBodyDto } from './dtos/updateBaseMemoBody.dto';

@ApiBearerAuth()
@ApiTags('bases')
@Controller('bases')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_REQ005' })
  @Patch(':id/memo')
  async updateBaseMemo(
    @Param('id') id: number,
    @Body() body: UpdateBaseMemoBodyDto,
  ) {
    await this.baseService.updateBaseMemo(id, body);

    return null;
  }
}
