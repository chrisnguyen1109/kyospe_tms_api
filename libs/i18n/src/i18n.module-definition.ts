import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass } = new ConfigurableModuleBuilder()
  .setClassMethodName('init')
  .build();
