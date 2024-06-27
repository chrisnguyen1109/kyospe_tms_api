import { ApiMultipartFormData } from '@app/common/decorators/apiMultipartFormData.decorator';
import { ApiSuccessResponse } from '@app/common/decorators/apiSuccessResponse.decorator';
import { LoginUser } from '@app/common/decorators/loginUser.decorator';
import { Roles } from '@app/common/decorators/roles.decorator';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { IMAGE_MAX_SIZE } from '@app/common/types/constant.type';
import { RoleDiv } from '@app/common/types/div.type';
import { imagePattern } from '@app/common/utils/regexPattern.util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDeliveryImageResponseDto } from './dtos/createDeliveryImageResponse.dto';
import { CreateDeliveryImageUploadDto } from './dtos/createDeliveryImageUpload.dto';
import { DeleteDeliveryImageParamDto } from './dtos/deleteDeliveryImageParam.dto';
import { GetListSlipsQueryDto } from './dtos/getListSlipsQuery.dto';
import { GetListSlipsResponseDto } from './dtos/getListSlipsResponse.dto';
import { GetSlipResponseDto } from './dtos/getSlipResponse.dto';
import { UpdateAssignMemoBodyDto } from './dtos/updateAssignMemoBody.dto';
import { SlipService } from './slip.service';

@ApiBearerAuth()
@ApiTags('slips')
@Controller('slips')
export class SlipController {
  constructor(private readonly slipService: SlipService) {}

  @ApiSuccessResponse({ model: GetListSlipsResponseDto })
  @ApiOperation({ summary: 'TRN_REQ001' })
  @Roles(RoleDiv.SYSTEM_ADMIN, RoleDiv.KYOTO_SPACER)
  @Get()
  async getListSlips(@Query() listSlipsQuery: GetListSlipsQueryDto) {
    const response = await this.slipService.getListSlips(listSlipsQuery);

    return new GetListSlipsResponseDto(response);
  }

  @ApiSuccessResponse({ model: GetSlipResponseDto })
  @ApiOperation({ summary: 'TRN_REQ002' })
  @Get(':slipNo')
  async getSlip(
    @Param('slipNo') slipNo: string,
    @LoginUser() currentUser: LoginUserDto,
  ) {
    const response = await this.slipService.getSlipDetail(slipNo, currentUser);

    return new GetSlipResponseDto(response);
  }

  @ApiSuccessResponse({ model: CreateDeliveryImageResponseDto })
  @ApiMultipartFormData(CreateDeliveryImageUploadDto)
  @ApiOperation({ summary: 'TRN_CRS011' })
  @UseInterceptors(FileInterceptor('deliveryImage'))
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Post(':slipNo/delivery-image')
  async createDeliveryImage(
    @LoginUser() currentUser: LoginUserDto,
    @Param('slipNo') slipNo: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: imagePattern })
        .addMaxSizeValidator({ maxSize: IMAGE_MAX_SIZE })
        .build(),
    )
    deliveryImage: Express.Multer.File,
  ) {
    const response = await this.slipService.createDeliveryImage(
      currentUser,
      slipNo,
      deliveryImage,
    );

    return new CreateDeliveryImageResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS011' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Delete(':slipNo/delivery-image/:imageNo')
  async deleteDeliveryImage(
    @LoginUser() currentUser: LoginUserDto,
    @Param() param: DeleteDeliveryImageParamDto,
  ) {
    await this.slipService.deleteDeliveryImage(currentUser, param);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_REQ007' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch('/:slipNo/assign-memo')
  async updateAssignMemo(
    @Param('slipNo') slipNo: string,
    @Body() body: UpdateAssignMemoBodyDto,
    @LoginUser() currentUser: LoginUserDto,
  ) {
    await this.slipService.updateAssignMemo(slipNo, currentUser, body);

    return null;
  }
}
