import { IsDriverGuard } from '@api/auth/guards/isDriver.guard';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGpsActBodyDto } from './dtos/createGpsActBody.dto';
import { CreateGpsActResponseDto } from './dtos/createGpsActResponse.dto';
import { GpsActService } from './gpsAct.service';

@ApiBearerAuth()
@ApiTags('drivers')
@Controller('gpsActs')
export class GpsActController {
  constructor(private readonly gpsActService: GpsActService) {}

  @ApiSuccessResponse({ example: CreateGpsActResponseDto })
  @ApiOperation({ summary: 'TRN_CRS018' })
  @UseGuards(IsDriverGuard)
  @Post()
  async createGpsAct(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateGpsActBodyDto,
  ) {
    const response = await this.gpsActService.createGpsAct(currentUser, body);

    return new CreateGpsActResponseDto(response);
  }
}
