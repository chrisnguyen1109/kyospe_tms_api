import { Transport } from '@nestjs/microservices';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BatchConfigDto {
  transport: Transport.TCP = Transport.TCP;

  @IsString()
  @IsOptional()
  host?: string;

  @IsNumber()
  @IsOptional()
  port?: number;
}
