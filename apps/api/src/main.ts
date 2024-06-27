import { AppConfigService } from '@app/app-config/appConfig.service';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import path from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const appConfigService = app.get(AppConfigService);

  const apiPrefix = appConfigService.apiConfig.apiPrefix;
  const apiVersion = appConfigService.apiConfig.apiVersion;
  const apiPort = appConfigService.apiConfig.apiPort;
  const version = appConfigService.apiConfig.version;

  app.enable('trust-proxy');
  app.enableShutdownHooks();
  app.useStaticAssets(path.join(__dirname, './public'));
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  if (!appConfigService.isProdEnv) {
    const config = new DocumentBuilder()
      .setTitle('KYS Admin API')
      .setDescription('KYS Admin API description')
      .setVersion(version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(apiPort);
}

bootstrap();
