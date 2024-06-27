import { IsNumber, IsOptional } from 'class-validator';

export class IfConfigDto {
  @IsNumber()
  @IsOptional()
  limitRecord?: number;
}
