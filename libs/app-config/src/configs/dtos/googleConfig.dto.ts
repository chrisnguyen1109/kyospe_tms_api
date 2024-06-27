import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleConfigDto {
  @IsString()
  @IsNotEmpty()
  apiUrl: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
