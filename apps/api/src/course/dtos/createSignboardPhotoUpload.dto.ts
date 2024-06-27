import { ApiProperty } from '@nestjs/swagger';

export class CreateSignboardPhotoUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  signboardPhoto: any;
}
