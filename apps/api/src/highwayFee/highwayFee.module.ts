import { AuthModule } from '@api/auth/auth.module';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
import { THighwayFeeReceiptImageEntity } from '@app/database/entities/tHighwayFeeReceiptImage.entity';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { THighwayFeeRepository } from '@app/database/repositories/tHighwayFee.repository';
import { THighwayFeeReceiptImageRepository } from '@app/database/repositories/tHighwayFeeReceiptImage.repository';
import { THighwayFeeSubscriber } from '@app/database/subscribers/tHighwayFee.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighwayFeeController } from './highwayFee.controller';
import { HighwayFeeService } from './highwayFee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      THighwayFeeEntity,
      TCourseEntity,
      THighwayFeeReceiptImageEntity,
    ]),
    AuthModule,
  ],
  controllers: [HighwayFeeController],
  providers: [
    HighwayFeeService,
    THighwayFeeRepository,
    THighwayFeeSubscriber,
    TCourseRepository,
    THighwayFeeReceiptImageRepository,
    THighwayFeeSubscriber,
    THighwayFeeReceiptImageEntity,
  ],
})
export class HighwayFeeModule {}
