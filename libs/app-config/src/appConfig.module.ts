import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './appConfig.module-definition';
import { AppConfigService } from './appConfig.service';
import { mapAppConfig } from '@app/common/utils/mapAppConfig.util';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule extends ConfigurableModuleClass {
  static override forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const configFactories = mapAppConfig(options.inject);

    const configOptions: ConfigModuleOptions = {
      cache: true,
      expandVariables: true,
      load: configFactories,
    };

    return {
      ...super.forRoot(options),
      imports: [ConfigModule.forRoot(configOptions)],
    };
  }
}
