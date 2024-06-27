import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { Roles } from '@app/common/decorators/roles.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { RoleDiv } from '@app/common/types/div.type';
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransportCompanyBodyDto } from './dtos/createTransportCompanyBody.dto';
import { CreateTransportCompanyResponseDto } from './dtos/createTransportCompanyResponse.dto';
import { GetListTransportCompanyQueryDto } from './dtos/getListTransportCompanyQuery.dto';
import { GetListTransportCompanyResponseDto } from './dtos/getListTransportCompanyResponse.dto';
import { UpdateTransportCompanyBodyDto } from './dtos/updateTransportCompanyBody.dto';
import { UpdateTransportCompanyResponseDto } from './dtos/updateTransportCompanyResponse.dto';
import { TransportCompanyService } from './transportCompany.service';

@ApiBearerAuth()
@ApiTags('transport-companies')
@Controller('transport-companies')
export class TransportCompanyController {
  constructor(
    private readonly transportCompanyService: TransportCompanyService,
  ) {}

  @ApiSuccessResponse({ model: GetListTransportCompanyResponseDto })
  @ApiOperation({ summary: 'MST_TCM001' })
  @Get()
  async getListTransportCompanies(
    @LoginUser() currentUser: LoginUserDto,
    @Query() listTransportCompanyQuery: GetListTransportCompanyQueryDto,
  ) {
    const response =
      await this.transportCompanyService.getListTransportCompanies(
        currentUser,
        listTransportCompanyQuery,
      );

    return new GetListTransportCompanyResponseDto(response);
  }

  @ApiSuccessResponse({ model: CreateTransportCompanyResponseDto })
  @ApiOperation({ summary: 'MST_TCM002' })
  @Roles(RoleDiv.SYSTEM_ADMIN, RoleDiv.KYOTO_SPACER, RoleDiv.TRANSPORT_COMPANY)
  @Post()
  async createTransportCompany(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateTransportCompanyBodyDto,
  ) {
    const response = await this.transportCompanyService.createTransportCompany(
      currentUser,
      body,
    );

    return new CreateTransportCompanyResponseDto(response);
  }

  @ApiSuccessResponse({ model: UpdateTransportCompanyResponseDto })
  @ApiOperation({ summary: 'MST_TCM002' })
  @Patch(':id')
  async updateTransportCompany(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @Body() body: UpdateTransportCompanyBodyDto,
  ) {
    const response = await this.transportCompanyService.updateTransportCompany(
      currentUser,
      id,
      body,
    );

    return new UpdateTransportCompanyResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'MST_TCM002' })
  @Roles(RoleDiv.SYSTEM_ADMIN, RoleDiv.KYOTO_SPACER, RoleDiv.TRANSPORT_COMPANY)
  @Delete(':id')
  async deleteTransportCompany(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
  ) {
    await this.transportCompanyService.deleteTransportCompany(currentUser, id);

    return null;
  }

  @ApiSuccessResponse({ example: true })
  @ApiOperation({ summary: 'MST_TCM002' })
  @Get(':id/check-delete')
  checkDeleteTransportCompany(@Param('id') id: number) {
    return this.transportCompanyService.checkDeleteTransportCompany(id);
  }
}
