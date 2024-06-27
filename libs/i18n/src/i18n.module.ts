import { AppConfigService } from '@app/app-config/appConfig.service';
import { DynamicModule, Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import path from 'node:path';
import { ConfigurableModuleClass } from './i18n.module-definition';

@Module({})
export class CustomI18nModule extends ConfigurableModuleClass {
  static override init(): DynamicModule {
    return {
      ...super.init({}),
      imports: [
        I18nModule.forRootAsync({
          inject: [AppConfigService],
          resolvers: [AcceptLanguageResolver],
          useFactory: (appConfigService: AppConfigService) => {
            return {
              fallbackLanguage: appConfigService.commonConfig.language,
              loaderOptions: {
                path: appConfigService.isTestEnv
                  ? path.join(process.cwd(), './libs/i18n/src/')
                  : path.join(__dirname, './i18n/'),
                watch: true,
              },
              logging: appConfigService.isDevEnv || appConfigService.isQAEnv,
              typesOutputPath: path.join(
                process.cwd(),
                './libs/i18n/src/i18n.type.ts',
              ),
            };
          },
        }),
      ],
      exports: [I18nModule],
    };
  }
}
