import { TestGuard } from '@api/auth/guards/test.guard';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';

@ApiBearerAuth()
@ApiTags('delivery')
@UseGuards(TestGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_DLV004' })
  @HttpCode(HttpStatus.OK)
  @Post('confirm-actual')
  confirmActualData() {
    return this.deliveryService.confirmActualData();
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_DLV001' })
  @HttpCode(HttpStatus.OK)
  @Post('assign-course')
  assignCourse() {
    return this.deliveryService.assignCourse();
  }
}
