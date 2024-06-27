import { StatusDiv } from '@app/common/types/div.type';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkStatusSignUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  electronicSignatureImage: any;

  @ApiProperty({
    required: true,
    enum: StatusDiv,
    enumName: 'StatusDiv',
    example: StatusDiv.UNFINISHED,
  })
  statusDiv: StatusDiv;
}
