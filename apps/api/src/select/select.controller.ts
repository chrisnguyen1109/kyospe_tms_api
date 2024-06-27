import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SelectService } from './select.service';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { GetBaseParamsResponseDto } from './dtos/getBaseParamsResponse.dto';
import { GetTransportCompanyParamsResponseDto } from './dtos/getTransportCompanyParamsResponse.dto';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { GetDriverParamsResponseDto } from './dtos/getDriverParamsResponse.dto';
import { GetDriverParamsQueryDto } from './dtos/getDriverParamsQuery.dto';
import { GetCarParamsResponseDto } from './dtos/getCarParamsResponse.dto';
import { GetCourseParamsResponseDto } from './dtos/getCourseParamsResponse.dto';
import { GetCarQueryDto } from './dtos/getCarQuery.dto';

@ApiTags('select')
@ApiBearerAuth()
@Controller('select')
export class SelectController {
  constructor(private readonly selectService: SelectService) {}

  @ApiSuccessResponse({
    model: GetBaseParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_BAS001' })
  @Get('bases')
  async getBaseParams() {
    const response = await this.selectService.getBaseParams();

    return response.map(item => new GetBaseParamsResponseDto(item));
  }

  @ApiSuccessResponse({
    model: GetTransportCompanyParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_TCM001' })
  @Get('companies')
  async getTransportCompanyParams(@LoginUser() currentUser: LoginUserDto) {
    const response = await this.selectService.getTransportCompanyParams(
      currentUser,
    );

    return response.map(item => new GetTransportCompanyParamsResponseDto(item));
  }

  @ApiSuccessResponse({
    model: GetTransportCompanyParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_TCM002' })
  @Get('parents')
  async getParentCompanyParams(@LoginUser() currentUser: LoginUserDto) {
    const response = await this.selectService.getParentCompanyParams(
      currentUser,
    );

    return response.map(item => new GetTransportCompanyParamsResponseDto(item));
  }

  @ApiSuccessResponse({
    model: GetTransportCompanyParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_TCM003' })
  @Get('carriages')
  async getCarriageCompanyParams(@LoginUser() currentUser: LoginUserDto) {
    const response = await this.selectService.getCarriageCompanyParams(
      currentUser,
    );

    return response.map(item => new GetTransportCompanyParamsResponseDto(item));
  }

  @ApiSuccessResponse({
    model: GetDriverParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_DRV001' })
  @Get('drivers')
  async getDriverParams(
    @LoginUser() currentUser: LoginUserDto,
    @Query() driverQuery: GetDriverParamsQueryDto,
  ) {
    const response = await this.selectService.getDriverParams(
      currentUser,
      driverQuery,
    );

    return response.map(item => new GetDriverParamsResponseDto(item));
  }

  @ApiSuccessResponse({
    model: GetCarParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_CAR001' })
  @Get('cars')
  async getCarParams(
    @LoginUser() currentUser: LoginUserDto,
    @Query() carQuery: GetCarQueryDto,
  ) {
    const response = await this.selectService.getCarParams(
      currentUser,
      carQuery,
    );

    return response.map(item => new GetCarParamsResponseDto(item));
  }

  @ApiSuccessResponse({
    model: GetCourseParamsResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'SEL_CRS001' })
  @Get('courses')
  async getCourseParams(@LoginUser() user: LoginUserDto) {
    const response = await this.selectService.getCourseParams(user);

    return response.map(item => new GetCourseParamsResponseDto(item));
  }
}
