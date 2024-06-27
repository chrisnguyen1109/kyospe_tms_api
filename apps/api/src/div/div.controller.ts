import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DivService } from './div.service';
import { GetDivParamsResponseDto } from './dtos/getDivParamsResponse.dto';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';

@ApiTags('div')
@ApiBearerAuth()
@Controller('div')
export class DivController {
  constructor(private readonly divService: DivService) {}

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN001' })
  @Get('role-div')
  async getRoleDivParams(@LoginUser() currentUser: LoginUserDto) {
    const response = await this.divService.getRoleDivParams(currentUser);

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN002' })
  @Get('dispatch-status-div')
  async getDispatchStatusDivParams() {
    const response = await this.divService.getDispatchStatusDivParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN003' })
  @Get('delivery-status-div')
  async getDeliveryStatusDivParams() {
    const response = await this.divService.getDeliveryStatusDivParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN004' })
  @Get('slip-status-div')
  async getSlipStatusParams() {
    const response = await this.divService.getSlipStatusParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN005' })
  @Get('payment-method-div')
  async getPaymentMethodDivParams() {
    const response = await this.divService.getPaymentMethodDivParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN006' })
  @Get('delivery-div')
  async getDeliveryDivParams() {
    const response = await this.divService.getDeliveryDivParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN012' })
  @Get('car-size')
  async getCarSizeParams() {
    const response = await this.divService.getCarSizeParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN013' })
  @Get('car-type')
  async getCarTypeParams() {
    const response = await this.divService.getCarTypeParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN008' })
  @Get('work-kinds')
  async getWorkKindsParams() {
    const response = await this.divService.getWorkKindsParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }

  @ApiSuccessResponse({ model: GetDivParamsResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_KBN010' })
  @Get('status-div')
  async getStatusDivParams() {
    const response = await this.divService.getStatusDivParams();

    return response.map(item => new GetDivParamsResponseDto(item));
  }
}
