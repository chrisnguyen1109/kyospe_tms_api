import { IsNotEmpty, IsString } from 'class-validator';

export class AuthConfigDto {
  @IsString()
  @IsNotEmpty()
  atPrivateKey: string;

  @IsString()
  @IsNotEmpty()
  atPublicKey: string;

  @IsString()
  @IsNotEmpty()
  atExpire: string;

  @IsString()
  @IsNotEmpty()
  rtPrivateKey: string;

  @IsString()
  @IsNotEmpty()
  rtPublicKey: string;

  @IsString()
  @IsNotEmpty()
  rtExpire: string;
}
