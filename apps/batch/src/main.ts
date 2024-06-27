import { BATCH_HOST, BATCH_PORT } from '@app/common/types/constant.type';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: BATCH_HOST,
        port: BATCH_PORT,
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();
}

bootstrap();
