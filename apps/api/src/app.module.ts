import { COM_COM001_002Exception } from '@app/common/filters/exceptions/COM_COM001_002.exception';
import { GlobalExceptionsFilter } from '@app/common/filters/globalException.filter';
import { CustomClassSerializerInterceptor } from '@app/common/interceptors/customClassSerializer.interceptor';
import { CustomClsInterceptor } from '@app/common/interceptors/customCls.interceptor';
import { SuccessResponseInterceptor } from '@app/common/interceptors/successResponse.interceptor';
import { TrimPipe } from '@app/common/pipes/trim.pipe';
import { handleClassValidatorErr } from '@app/common/utils/handleClassValidatorErr.util';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import pino from 'pino-http';
import { PrettyOptions } from 'pino-pretty';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { BaseModule } from './base/base.module';
import { CarModule } from './car/car.module';
import { CourseModule } from './course/course.module';
import { DeliveryModule } from './delivery/delivery.module';
import { DivModule } from './div/div.module';
import { DriverModule } from './driver/driver.module';
import { HighwayFeeModule } from './highwayFee/highwayFee.module';
import { IfModule } from './if/if.module';
import { SelectModule } from './select/select.module';
import { SharedModule } from './shared/shared.module';
import { SlipModule } from './slip/slip.module';
import { SpotModule } from './spot/spot.module';
import { TransportCompanyModule } from './transportCompany/transportCompany.module';
import { UserModule } from './user/user.module';
import { GpsActModule } from './gpsAct/gpsAct.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    TransportCompanyModule,
    SelectModule,
    DivModule,
    DriverModule,
    CarModule,
    SlipModule,
    IfModule,
    CourseModule,
    HighwayFeeModule,
    DeliveryModule,
    SpotModule,
    BaseModule,
    GpsActModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomClsInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory(errors) {
          const errorMessage = handleClassValidatorErr(errors);

          throw new COM_COM001_002Exception(errorMessage);
        },
      }),
    },
    {
      provide: APP_PIPE,
      useClass: TrimPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        helmet(),
        pino({
          name: 'HTTP',
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
            } satisfies PrettyOptions,
          },
        }),
        compression(),
      )
      .forRoutes('*');
  }
}
