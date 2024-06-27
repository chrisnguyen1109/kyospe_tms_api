import { IsOptional, IsString } from 'class-validator';

export class MailConfigDto {
  @IsString()
  @IsOptional()
  connectionString?: string;

  @IsString()
  @IsOptional()
  from?: string;
}
