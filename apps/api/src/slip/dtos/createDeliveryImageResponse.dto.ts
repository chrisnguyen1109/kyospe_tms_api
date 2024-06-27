import { faker } from '@faker-js/faker/locale/af_ZA';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateDeliveryImageResponseDto {
  @ApiProperty({ example: faker.image.url() })
  @Expose()
  image1?: string;

  @Expose()
  image2?: string;

  @Expose()
  image3?: string;

  @Expose()
  image4?: string;

  @Expose()
  image5?: string;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }
}
