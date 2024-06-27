import { IsNotEmpty, IsString } from 'class-validator';

export class BlobStorageConfigDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  accountKey: string;

  @IsString()
  @IsNotEmpty()
  containerName: string;
}
