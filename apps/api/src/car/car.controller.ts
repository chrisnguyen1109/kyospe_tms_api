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
import { CarService } from './car.service';
import { CreateCarBodyDto } from './dtos/createCarBody.dto';
import { CreateCarResponseDto } from './dtos/createCarResponse.dto';
import { GetListCarsQueryDto } from './dtos/getListCarsQuery.dto';
import { GetListCarsResponseDto } from './dtos/getListCarsResponse.dto';
import { UpdateCarBodyDto } from './dtos/updateCarBody.dto';
import { UpdateCarResponseDto } from './dtos/updateCarResponse.dto';

@ApiBearerAuth()
@ApiTags('cars')
@Roles(
  RoleDiv.SYSTEM_ADMIN,
  RoleDiv.TRANSPORT_COMPANY,
  RoleDiv.CARRIAGE_COMPANY,
)
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiSuccessResponse({ model: GetListCarsResponseDto })
  @ApiOperation({ summary: 'MST_CAR001' })
  @Get()
  async getListCars(
    @LoginUser() currentUser: LoginUserDto,
    @Query() listCarQuery: GetListCarsQueryDto,
  ) {
    const response = await this.carService.getListCars(
      currentUser,
      listCarQuery,
    );

    return new GetListCarsResponseDto(response);
  }

  @ApiSuccessResponse({ model: CreateCarResponseDto })
  @ApiOperation({ summary: 'MST_CAR002' })
  @Post()
  async createCar(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateCarBodyDto,
  ) {
    const response = await this.carService.createCar(currentUser, body);

    return new CreateCarResponseDto(response);
  }

  @ApiSuccessResponse({ model: UpdateCarResponseDto })
  @ApiOperation({ summary: 'MST_CAR002' })
  @Patch(':id')
  async updateCar(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @Body() body: UpdateCarBodyDto,
  ) {
    const response = await this.carService.updateCar(currentUser, id, body);

    return new UpdateCarResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'MST_CAR002' })
  @Delete(':id')
  async deleteCar(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
  ) {
    await this.carService.deleteCar(currentUser, id);

    return null;
  }
}
