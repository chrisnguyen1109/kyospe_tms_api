import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { Roles } from '@app/common/decorators/roles.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { RoleDiv } from '@app/common/types/div.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverBodyDto } from './dtos/createDriverBody.dto';
import { CreateDriverResponseDto } from './dtos/createDriverResponse.dto';
import { GetListDriversQueryDto } from './dtos/getListDriversQuery.dto';
import { GetListDriversResponseDto } from './dtos/getListDriversResponse.dto';
import { UpdateDriverBody } from './dtos/updateDriverBody.dto';
import { UpdateDriverResponseDto } from './dtos/updateDriverResponse.dto';

@ApiBearerAuth()
@ApiTags('drivers')
@Roles(
  RoleDiv.SYSTEM_ADMIN,
  RoleDiv.TRANSPORT_COMPANY,
  RoleDiv.CARRIAGE_COMPANY,
)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiSuccessResponse({ model: GetListDriversResponseDto })
  @ApiOperation({ summary: 'MST_DRV001' })
  @Get()
  async getListDrivers(
    @LoginUser() currentUser: LoginUserDto,
    @Query() listDriverQuery: GetListDriversQueryDto,
  ) {
    const response = await this.driverService.getListDrivers(
      currentUser,
      listDriverQuery,
    );

    return new GetListDriversResponseDto(response);
  }

  @ApiSuccessResponse({ model: CreateDriverResponseDto })
  @ApiOperation({ summary: 'MST_DRV002' })
  @Post()
  async createDriver(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateDriverBodyDto,
  ) {
    const response = await this.driverService.createDriver(currentUser, body);

    return new CreateDriverResponseDto(response);
  }

  @ApiSuccessResponse({ model: UpdateDriverResponseDto })
  @ApiOperation({ summary: 'MST_DRV002' })
  @Patch(':id')
  async updateDriver(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @Body() body: UpdateDriverBody,
  ) {
    const response = await this.driverService.updateDriver(
      currentUser,
      id,
      body,
    );

    return new UpdateDriverResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'MST_DRV002' })
  @Delete(':id')
  async deleteDriver(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
  ) {
    await this.driverService.deleteDriver(currentUser, id);

    return null;
  }
}
