import { TestGuard } from '@api/auth/guards/test.guard';
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
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CourseService } from './course.service';
import { AssignCarAndDriverBodyDto } from './dtos/assignCarAndDriverBody.dto';
import { AssignCarAndDriverParamDto } from './dtos/assignCarAndDriverParam.dto';
import { AssignSpotsToCoursesBodyDto } from './dtos/assignSpotsToCoursesBody.dto';
import { CreateCourseBodyDto } from './dtos/createCourseBody.dto';
import { CreateCourseFrameBodyDto } from './dtos/createCourseFrameBody.dto';
import { CreateCourseFrameResponseDto } from './dtos/createCourseFrameResponse.dto';
import { CreateSignboardPhotoResponseDto } from './dtos/createSignboardPhotoResponse.dto';
import { CreateSignboardPhotoUploadDto } from './dtos/createSignboardPhotoUpload.dto';
import { DownloadSignboardPhotosQuery } from './dtos/downloadSignboardPhotosQuery.dto';
import { GetCountImageCourseQueryDto } from './dtos/getCountImageCourseQuery.dto';
import { GetCountImageCourseResponseDto } from './dtos/getCountImageCourseResponse.dto';
import { GetCourseAssignedQueryDto } from './dtos/getCourseAssignedQuery.dto';
import { GetCourseAssignedResponseDto } from './dtos/getCourseAssignedResponse.dto';
import { GetCoursesQueryDto } from './dtos/getCourseQuery.dto';
import { GetCourseResponseDto } from './dtos/getCourseResponse.dto';
import { GetListCoursesQueryDto } from './dtos/getListCourseQuery.dto';
import { GetListCoursesResponseDto } from './dtos/getListCoursesResponse.dto';
import { GetListMasterCourseQueryDto } from './dtos/getListMasterCourseQuery.dto';
import { GetListMasterCourseResponseDto } from './dtos/getListMasterCourseResponse.dto';
import { GetListSingleCourseQueryDto } from './dtos/getListSingleCourseQuery.dto';
import { GetListCourseSingleResponseDto } from './dtos/getListSingleCourseResponse.dto';
import { GetSingleCourseResponseDto } from './dtos/getSingleCourseDetailResponse.dto';
import { UnassignSpotsBodyDto } from './dtos/unassignSpotsBody.dto';
import { UpdateCourseBodyDto } from './dtos/updateCourseBody.dto';
import { UpdateCourseMemoBodyDto } from './dtos/updateCourseMemoBody.dto';
import { UpdateCourseParamDto } from './dtos/updateCourseParam.dto';
import { UpdateCourseStatusBodyDto } from './dtos/updateCourseStatusBody.dto';
import { UpdateListStatusCourseBody } from './dtos/updateListStatusCourseBody.dto';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiSuccessResponse({ model: GetListCoursesResponseDto, isArray: false })
  @ApiOperation({ summary: 'TRN_CRS003' })
  @Get()
  async getListCourses(
    @Query() listCoursesQuery: GetListCoursesQueryDto,
    @LoginUser() currentUser: LoginUserDto,
  ) {
    const response = await this.courseService.getListCourses(
      listCoursesQuery,
      currentUser,
    );

    return new GetListCoursesResponseDto(response);
  }

  @ApiSuccessResponse({ model: GetCourseResponseDto })
  @ApiOperation({ summary: 'TRN_CRS004' })
  @Get('detail')
  async getCourseDetail(
    @Query() coursesQuery: GetCoursesQueryDto,
    @LoginUser() currentUser: LoginUserDto,
  ) {
    const response = await this.courseService.getCourseDetail(
      coursesQuery,
      currentUser,
    );

    return new GetCourseResponseDto(response);
  }

  @ApiSuccessResponse({ model: GetCourseAssignedResponseDto, isArray: true })
  @ApiOperation({ summary: 'TRN_CRS017' })
  @Get('assigned')
  async getCourseAssigned(
    @Query() coursesQuery: GetCourseAssignedQueryDto,
    @LoginUser() currentUser: LoginUserDto,
  ) {
    const response = await this.courseService.getCourseAssigned(
      coursesQuery,
      currentUser,
    );

    return response.map(item => new GetCourseAssignedResponseDto(item));
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS014' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Post()
  async createCourse(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateCourseBodyDto,
  ) {
    await this.courseService.createCourse(currentUser, body);

    return null;
  }

  @ApiSuccessResponse({ model: CreateCourseFrameResponseDto })
  @ApiOperation({ summary: 'TRN_CRS002' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Post('frame')
  async createCourseFrame(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: CreateCourseFrameBodyDto,
  ) {
    const response = await this.courseService.createCourseFrame(
      currentUser,
      body,
    );

    return new CreateCourseFrameResponseDto(response);
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS016' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch(':courseSeqNo/status')
  async updateStatusCourse(
    @LoginUser() user: LoginUserDto,
    @Param('courseSeqNo') courseSeqNo: number,
  ) {
    await this.courseService.updateDispatchStatusCourse(user, courseSeqNo);

    return null;
  }

  @ApiSuccessResponse({ example: [1, 2] })
  @ApiOperation({ summary: 'TRN_CRS016' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch('status')
  async updateStatusListCourse(
    @LoginUser() user: LoginUserDto,
    @Body() body: UpdateListStatusCourseBody,
  ) {
    const response = await this.courseService.updateDispatchStatusCourseList(
      user,
      body,
    );

    return response;
  }

  @ApiSuccessResponse({ example: [1, 2] })
  @ApiOperation({ summary: 'TRN_CRS022' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch(':courseSeqNo/soft-delete')
  async updateSoftDeleteListCourse(
    @LoginUser() user: LoginUserDto,
    @Param('courseSeqNo') courseSeqNo: number,
  ) {
    const response = await this.courseService.updateSoftDeleteCourse(
      user,
      courseSeqNo,
    );

    return response;
  }

  @ApiSuccessResponse({ model: GetListMasterCourseResponseDto, isArray: true })
  @ApiOperation({ summary: 'MST_CRS001' })
  @Get('master')
  async getListMasterCourses(
    @LoginUser() user: LoginUserDto,
    @Query() query: GetListMasterCourseQueryDto,
  ) {
    const response = await this.courseService.getListMasterCourses(user, query);

    return response.map(res => new GetListMasterCourseResponseDto(res));
  }

  @ApiSuccessResponse({ example: [1, 2] })
  @ApiOperation({ summary: 'TRN_CRS005' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch('memo/courseId/:courseId/serviceYmd/:serviceYmd')
  async updateMemo(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: UpdateCourseMemoBodyDto,
    @Param() param: UpdateCourseParamDto,
  ) {
    const response = await this.courseService.updateCourseMemo(
      currentUser,
      body,
      param,
    );

    return response.map(res => res.courseSeqNo);
  }

  @Patch('assign-car-driver/courseId/:courseId/serviceYmd/:serviceYmd')
  async assignCarAndDriver(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: AssignCarAndDriverBodyDto,
    @Param() param: AssignCarAndDriverParamDto,
  ) {
    const response = await this.courseService.assignCarAndDriver(
      currentUser,
      body,
      param,
    );

    return response.map(res => res.courseSeqNo);
  }

  @ApiSuccessResponse({ example: [1, 2] })
  @ApiOperation({ summary: 'TRN_CRS015' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch('courseId/:courseId/serviceYmd/:serviceYmd')
  async updateCourse(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: UpdateCourseBodyDto,
    @Param() param: UpdateCourseParamDto,
  ) {
    const response = await this.courseService.updateCourse(
      currentUser,
      body,
      param,
    );

    return response.map(res => res.courseSeqNo);
  }

  @ApiSuccessResponse({ model: GetListCourseSingleResponseDto, isArray: true })
  @ApiOperation({ summary: 'TRN_CRS012' })
  @Get('single')
  async getListSingleCourse(
    @LoginUser() user: LoginUserDto,
    @Query() courseQuery: GetListSingleCourseQueryDto,
  ) {
    const response = await this.courseService.getListSingleCourse(
      user,
      courseQuery,
    );

    return response.map(res => new GetListCourseSingleResponseDto(res));
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS010' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @Patch(':courseSeqNo/delivery-status')
  async updateCourseStatus(
    @LoginUser() currentUser: LoginUserDto,
    @Param('courseSeqNo') courseSeqNo: number,
    @Body() body: UpdateCourseStatusBodyDto,
  ) {
    await this.courseService.updateCourseStatus(currentUser, courseSeqNo, body);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS001' })
  @UseGuards(TestGuard)
  @HttpCode(HttpStatus.OK)
  @Post('auto-create-course')
  autoCreateCourse() {
    return this.courseService.autoCreateCourse();
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS001' })
  @UseGuards(TestGuard)
  @Patch('update-delivery-status')
  updateCourseDeliveryStatus() {
    return this.courseService.updateCourseDeliveryStatus();
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_CRS001' })
  @UseGuards(TestGuard)
  @Patch('delete-gps-act')
  deletePastGpsAct() {
    return this.courseService.deletePastGpsAct();
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_DLV003' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @HttpCode(HttpStatus.OK)
  @Post('assign-spots')
  async assignSpotsToCourses(
    @LoginUser() currentUser: LoginUserDto,
    @Body() body: AssignSpotsToCoursesBodyDto,
  ) {
    await this.courseService.assignSpotsToCourses(currentUser, body);

    return null;
  }

  @ApiSuccessResponse({ example: null })
  @ApiOperation({ summary: 'TRN_DLV003' })
  @Roles(
    RoleDiv.SYSTEM_ADMIN,
    RoleDiv.TRANSPORT_COMPANY,
    RoleDiv.CARRIAGE_COMPANY,
  )
  @HttpCode(HttpStatus.OK)
  @Post('unassign-spots')
  async unassignSpots(@Body() body: UnassignSpotsBodyDto) {
    await this.courseService.unassignSpots(body);

    return null;
  }

  @ApiSuccessResponse({ model: GetSingleCourseResponseDto })
  @ApiOperation({ summary: 'TRN_CRS013' })
  @Get(':courseSeqNo/single')
  async getSingleCourseDetail(
    @LoginUser() currentUser: LoginUserDto,
    @Param('courseSeqNo') courseSeqNo: number,
  ) {
    const response = await this.courseService.getSingleCourseDetail(
      courseSeqNo,
      currentUser,
    );

    return new GetSingleCourseResponseDto(response);
  }

  @ApiSuccessResponse({ model: GetCountImageCourseResponseDto })
  @ApiOperation({ summary: 'TRN_CRS019' })
  @Get('countImage')
  async getCountImageCourse(
    @LoginUser() currentUser: LoginUserDto,
    @Query() query: GetCountImageCourseQueryDto,
  ) {
    const response = await this.courseService.getCountImageCourse(
      currentUser,
      query,
    );

    return new GetCountImageCourseResponseDto(response);
  }

  @ApiSuccessResponse({ model: CreateSignboardPhotoResponseDto })
  @ApiMultipartFormData(CreateSignboardPhotoUploadDto)
  @ApiOperation({ summary: 'TRN_CRS011' })
  @UseInterceptors(FileInterceptor('signboardPhoto'))
  @Post(':courseSeqNo/signboard-photo')
  async createSignboardPhoto(
    @LoginUser() currentUser: LoginUserDto,
    @Param('courseSeqNo') courseSeqNo: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: imagePattern })
        .addMaxSizeValidator({ maxSize: IMAGE_MAX_SIZE })
        .build(),
    )
    signboardPhoto: Express.Multer.File,
  ) {
    const response = await this.courseService.createSignboardPhoto(
      currentUser,
      courseSeqNo,
      signboardPhoto,
    );

    return new CreateSignboardPhotoResponseDto(response);
  }

  @ApiOperation({ summary: 'TRN_CRS020' })
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename="signboard_photos.zip"')
  @Get('signboard-photo')
  async downloadSignboardPhotos(
    @Res() res: Response,
    @LoginUser() currentUser: LoginUserDto,
    @Query() query: DownloadSignboardPhotosQuery,
  ) {
    const archiver = await this.courseService.downloadSignboardPhotos(
      currentUser,
      query,
    );
    archiver.pipe(res);

    await archiver.finalize();
  }
}
