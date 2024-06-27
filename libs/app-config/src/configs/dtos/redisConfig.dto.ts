import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RedisConfigDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;
}
