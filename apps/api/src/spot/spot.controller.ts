import { ApiMultipartFormData } from '@app/common/decorators/apiMultipartFormData.decorator';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { IMAGE_MAX_SIZE } from '@app/common/types/constant.type';
import { imagePattern } from '@app/common/utils/regexPattern.util';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUnassignSpotResponseDto } from './dtos/getUnassignSpotsResponse.dto';
import { UpdateLatLngBodyDto } from './dtos/updateLatLngBody.dto';
import { UpdateWorkMemoBodyDto } from './dtos/updateWorkMemoBody.dto';
import { UpdateWorkStatusNoSignBodyDto } from './dtos/updateWorkStatusNoSignBody.dto';
import { UpdateWorkStatusSignBodyDto } from './dtos/updateWorkStatusSignBody.dto';
import { UpdateWorkStatusSignUploadDto } from './dtos/updateWorkStatusSignUpload.dto';
import { SpotService } from './spot.service';

@ApiTags('spots')
@ApiBearerAuth()
@Controller('spots')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @ApiSuccessResponse({ model: GetUnassignSpotResponseDto, isArray: true })
  @ApiOperation({ summary: 'TRN_DLV002' })
  @Get('unassign/:serviceYmd')
  async getUnassignSpots(
    @LoginUser() currentUser: LoginUserDto,
    @Param('serviceYmd') serviceYmd: string,
  ) {
    const response = await this.spotService.getUnassignSpots(
      serviceYmd,
      currentUser,
    );

    return response.map(item => new GetUnassignSpotResponseDto(item));
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_REQ006' })
  @Patch(':id/work-memo')
  async updateWorkMemo(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @Body() body: UpdateWorkMemoBodyDto,
  ) {
    await this.spotService.updateWorkMemo(currentUser, id, body);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS007' })
  @Patch(':id/work-status/no-sign')
  async updateWorkStatusNoSign(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @Body() body: UpdateWorkStatusNoSignBodyDto,
  ) {
    await this.spotService.updateWorkStatusNoSign(currentUser, id, body);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiMultipartFormData(UpdateWorkStatusSignUploadDto)
  @ApiOperation({ summary: 'TRN_CRS007' })
  @UseInterceptors(FileInterceptor('electronicSignatureImage'))
  @Patch(':id/work-status/sign')
  async updateWorkStatusSign(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: imagePattern })
        .addMaxSizeValidator({ maxSize: IMAGE_MAX_SIZE })
        .build(),
    )
    electronicSignatureImage: Express.Multer.File,
    @Body() body: UpdateWorkStatusSignBodyDto,
  ) {
    await this.spotService.updateWorkStatusSign(
      currentUser,
      id,
      electronicSignatureImage,
      body,
    );

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS006' })
  @Patch(':id/lat-lng')
  async updateLatLng(
    @LoginUser() currentUser: LoginUserDto,
    @Param('id') id: number,
    @Body() body: UpdateLatLngBodyDto,
  ) {
    await this.spotService.updateLatLng(currentUser, id, body);

    return null;
  }
}
