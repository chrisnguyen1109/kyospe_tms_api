import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { SessionId } from '@app/common/decorators/sessionId.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserBodyDto } from './dtos/createUserBody.dto';
import { CreateUserResponseDto } from './dtos/createUserResponse.dto';
import { GetListUserQueryDto } from './dtos/getListUserQuery.dto';
import { GetListUserResponseDto } from './dtos/getListUserResponse.dto';
import { GetProfileResponseDto } from './dtos/getProfileResponse.dto';
import { UpdateProfileBodyDto } from './dtos/updateProfileBody.dto';
import { UpdateProfileResponseDto } from './dtos/updateProfileResponse.dto';
import { UpdateUserBodyDto } from './dtos/updateUserBody.dto';
import { UpdateUserResponseDto } from './dtos/updateUserResponse.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiSuccessResponse({ model: GetProfileResponseDto })
  @ApiOperation({ summary: 'MST_USR003' })
  @Get('profile')
  async getProfile(@LoginUser('mUserId') mUserId: number) {
    const response = await this.userService.getProfile(mUserId);

    return new GetProfileResponseDto(response);
  }

  @ApiSuccessResponse({ model: GetListUserResponseDto })
  @ApiOperation({ summary: 'MST_USR001' })
  @Get()
  async getListUser(
    @LoginUser() currentUser: LoginUserDto,
    @Query() listUserQuery: GetListUserQueryDto,
  ) {
    const response = await this.userService.getListUser(
      currentUser,
      listUserQuery,
    );

    return new GetListUserResponseDto(response);
  }

  @ApiSuccessResponse({ model: UpdateProfileResponseDto })
  @ApiOperation({ summary: 'MST_USR002' })
  @Patch('profile')
  async updateProfile(
    @LoginUser('mUserId') mUserId: number,
    @SessionId() sessionId: string,
    @Body() body: UpdateProfileBodyDto,
  ) {
    const response = await this.userService.updateProfile(
      mUserId,
      sessionId,
      body,
    );

    return new UpdateProfileResponseDto(response);
  }

  @ApiSuccessResponse({
    model: CreateUserResponseDto,
    statusCode: HttpStatus.CREATED,
  })
  @ApiOperation({ summary: 'MST_USR002' })
  @Post()
  async createUser(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateUserBodyDto,
  ) {
    const response = await this.userService.createUser(currentUser, body);

    return new CreateUserResponseDto(response);
  }

  @ApiSuccessResponse({ model: UpdateUserResponseDto })
  @ApiOperation({ summary: 'MST_USR002' })
  @Patch(':id')
  async updateUser(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') mUserId: number,
    @Body() body: UpdateUserBodyDto,
  ) {
    const response = await this.userService.updateUser(
      currentUser,
      mUserId,
      body,
    );

    return new UpdateUserResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'MST_USR002' })
  @Delete(':id')
  async deleteUser(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') mUserId: number,
  ) {
    await this.userService.deleteUser(currentUser, mUserId);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'MST_USR002' })
  @Patch(':id/init-password')
  async initPassword(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') mUserId: number,
  ) {
    await this.userService.initPassword(currentUser, mUserId);

    return null;
  }
}
