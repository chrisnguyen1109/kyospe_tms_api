import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { RoutePublic } from '@app/common/decorators/routePublic.decorator';
import { SessionId } from '@app/common/decorators/sessionId.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotPasswordBodyDto } from './dtos/forgotPasswordBody.dto';
import { LoginBodyDto } from './dtos/loginBody.dto';
import { LoginResponseDto } from './dtos/loginResponse.dto';
import { RefreshTokenBodyDto } from './dtos/refreshTokenBody.dto';
import { RefreshTokenResponseDto } from './dtos/refreshTokenResponse.dto';
import { AuthLocalGuard } from './guards/authLocal.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { TestGuard } from './guards/test.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSuccessResponse({ model: LoginResponseDto })
  @ApiBody({ type: LoginBodyDto })
  @ApiOperation({ summary: 'COM_CER001' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthLocalGuard)
  @RoutePublic()
  @Post('login')
  async login(@LoginUser() user: LoginUserDto) {
    const response = await this.authService.login(user);

    return new LoginResponseDto(response);
  }

  @ApiSuccessResponse({ model: RefreshTokenResponseDto })
  @ApiBody({ type: RefreshTokenBodyDto })
  @ApiOperation({ summary: 'COM_CER001' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @RoutePublic()
  @Post('refresh-token')
  async refreshToken(
    @LoginUser() user: LoginUserDto,
    @SessionId() sessionId: string,
  ) {
    const response = await this.authService.refreshToken(user, sessionId);

    return new RefreshTokenResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'COM_CER001' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @LoginUser('mUserId') mUserId: number,
    @SessionId() sessionId: string,
  ) {
    await this.authService.logout(mUserId, sessionId);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'COM_CER002' })
  @HttpCode(HttpStatus.OK)
  @RoutePublic()
  @Post('forgot-password')
  async forgetPassword(@Body() body: ForgotPasswordBodyDto) {
    await this.authService.forgotPassword(body);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'COM_CER001' })
  @UseGuards(TestGuard)
  @HttpCode(HttpStatus.OK)
  @Post('remove-session')
  removeSession() {
    return this.authService.removeSession();
  }
}
