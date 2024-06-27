import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateSignboardPhotoResponseDto {
  @ApiProperty({ example: faker.image.url() })
  @Expose()
  signboardPhoto1?: string;

  @Expose()
  signboardPhoto2?: string;

  @Expose()
  signboardPhoto3?: string;

  @Expose()
  signboardPhoto4?: string;

  @Expose()
  signboardPhoto5?: string;

  @Expose()
  signboardPhoto6?: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
