import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { HttpGoogleConfigService } from './httpGoogleConfig.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpGoogleConfigService,
    }),
  ],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
