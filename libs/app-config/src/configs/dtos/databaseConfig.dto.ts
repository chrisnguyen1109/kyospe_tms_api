import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { DataSourceOptions } from 'typeorm';

export class DatabaseConfigDto {
  @IsString()
  @IsNotEmpty()
  type: DataSourceOptions['type'];

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  synchronize: boolean = false;

  @IsBoolean()
  @IsOptional()
  logging: boolean = false;
}
