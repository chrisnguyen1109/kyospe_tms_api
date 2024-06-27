import { AppConfig } from '@app/common/types/common.type';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface AppConfigModuleOptions {
  inject: AppConfig[];
}

export const { ConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<AppConfigModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
