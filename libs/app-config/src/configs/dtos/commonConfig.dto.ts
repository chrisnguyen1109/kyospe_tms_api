import { NodeEnvironment } from '@app/common/types/common.type';
import {
  DEFAULT_APP_URL,
  DEFAULT_LANGUAGE,
} from '@app/common/types/constant.type';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsLocale,
} from 'class-validator';

export class CommonConfigDto {
  @IsEnum(NodeEnvironment)
  @IsNotEmpty()
  nodeEnv: NodeEnvironment;

  @IsString()
  @IsOptional()
  appUrl: string = DEFAULT_APP_URL;

  @IsLocale()
  @IsOptional()
  language: string = DEFAULT_LANGUAGE;
}
