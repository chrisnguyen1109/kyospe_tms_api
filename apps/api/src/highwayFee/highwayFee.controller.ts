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
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHighwayFeeBodyDto } from './dtos/createHighwayFeeBody.dto';
import { CreateHighwayFeeResponseDto } from './dtos/createHighwayFeeResponse.dto';
import { CreateReceiptImageResponseDto } from './dtos/createReceiptImageResponse.dto';
import { CreateReceiptImageUploadDto } from './dtos/createReceiptImageUpload.dto';
import { UpdateHighwayFeeBodyDto } from './dtos/updateHighwayFeeBody.dto';
import { UpdateHighwayFeeResponseDto } from './dtos/updateHighwayFeeResponse.dto';
import { HighwayFeeService } from './highwayFee.service';

@ApiBearerAuth()
@ApiTags('highway-fees')
@Roles(
  RoleDiv.SYSTEM_ADMIN,
  RoleDiv.TRANSPORT_COMPANY,
  RoleDiv.CARRIAGE_COMPANY,
)
@Controller('highway-fees')
export class HighwayFeeController {
  constructor(private readonly highwayFeeService: HighwayFeeService) {}

  @ApiSuccessResponse({ model: CreateHighwayFeeResponseDto })
  @ApiOperation({ summary: 'TRN_CRS009' })
  @Post()
  async createHighwayFee(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateHighwayFeeBodyDto,
  ) {
    const response = await this.highwayFeeService.createHighwayFee(
      currentUser,
      body,
    );

    return new CreateHighwayFeeResponseDto(response);
  }

  @ApiSuccessResponse({ model: UpdateHighwayFeeResponseDto })
  @ApiOperation({ summary: 'TRN_CRS009' })
  @Patch(':highwayFeeNo')
  async updateHighwayFee(
    @LoginUser() currentUser: LoginUserDto,
    @Param('highwayFeeNo') highwayFeeNo: number,
    @Body() body: UpdateHighwayFeeBodyDto,
  ) {
    const response = await this.highwayFeeService.updateHighwayFee(
      currentUser,
      highwayFeeNo,
      body,
    );

    return new UpdateHighwayFeeResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS009' })
  @Delete(':highwayFeeNo')
  async deleteHighwayFee(
    @LoginUser() currentUser: LoginUserDto,
    @Param('highwayFeeNo') highwayFeeNo: number,
  ) {
    await this.highwayFeeService.deleteHighwayFee(currentUser, highwayFeeNo);

    return null;
  }

  @ApiSuccessResponse({ model: CreateReceiptImageResponseDto })
  @ApiMultipartFormData(CreateReceiptImageUploadDto)
  @ApiOperation({ summary: 'TRN_CRS011' })
  @UseInterceptors(FileInterceptor('receiptImage'))
  @Post(':highwayFeeNo/receipt-image')
  async createReceiptImage(
    @LoginUser() currentUser: LoginUserDto,
    @Param('highwayFeeNo') highwayFeeNo: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: imagePattern })
        .addMaxSizeValidator({ maxSize: IMAGE_MAX_SIZE })
        .build(),
    )
    receiptImage: Express.Multer.File,
  ) {
    const response = await this.highwayFeeService.createReceiptImage(
      currentUser,
      highwayFeeNo,
      receiptImage,
    );

    return new CreateReceiptImageResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS011' })
  @Delete('receipt-image/:imageNo')
  async deleteReceiptImage(
    @LoginUser() currentUser: LoginUserDto,
    @Param('imageNo') imageNo: number,
  ) {
    await this.highwayFeeService.deleteReceiptImage(currentUser, imageNo);

    return null;
  }
}
