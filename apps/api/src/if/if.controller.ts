import { TestGuard } from '@api/auth/guards/test.guard';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { Roles } from '@app/common/decorators/roles.decorator';
import { RoleDiv } from '@app/common/types/div.type';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IfService } from './if.service';

@ApiBearerAuth()
@ApiTags('if')
@Roles(RoleDiv.SYSTEM_ADMIN, RoleDiv.KYOTO_SPACER)
@Controller('if')
export class IfController {
  constructor(private readonly ifService: IfService) {}

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'IF_MST001' })
  @HttpCode(HttpStatus.OK)
  @Post('base')
  importMBase() {
    return this.ifService.importMBase();
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'IF_REQ001' })
  @HttpCode(HttpStatus.OK)
  @Post('slip')
  importSlip() {
    return this.ifService.importSlip();
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'IF_ESI001' })
  @UseGuards(TestGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign')
  exportSign() {
    return this.ifService.exportSign();
  }
}
