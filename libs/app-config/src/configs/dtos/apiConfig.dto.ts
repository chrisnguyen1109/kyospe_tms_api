import {
  DEFAULT_API_PREFIX,
  DEFAULT_API_VERSION,
  DEFAULT_VERSION,
} from '@app/common/types/constant.type';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ApiConfigDto {
  @IsNumber()
  @IsNotEmpty()
  apiPort: number;

  @IsString()
  @IsOptional()
  apiPrefix: string = DEFAULT_API_PREFIX;

  @IsString()
  @IsOptional()
  apiVersion: string = DEFAULT_API_VERSION;

  @IsString()
  @IsOptional()
  version: string = DEFAULT_VERSION;
}
