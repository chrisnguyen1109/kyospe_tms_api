import { IsOptional, IsString } from 'class-validator';

export class CronTimeConfigDto {
  @IsString()
  @IsOptional()
  connectSlipCronTime?: string;

  @IsString()
  @IsOptional()
  connectMasterCronTime?: string;

  @IsString()
  @IsOptional()
  connectSignCronTime?: string;

  @IsString()
  @IsOptional()
  autoCreatCourseCronTime?: string;

  @IsString()
  @IsOptional()
  confirmActualDataCronTime?: string;

  @IsString()
  @IsOptional()
  removeSessionCronTime?: string;
}
