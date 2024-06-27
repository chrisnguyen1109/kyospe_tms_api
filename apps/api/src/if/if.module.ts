import { Module } from '@nestjs/common';
import { IfController } from './if.controller';
import { IfService } from './if.service';

@Module({
  controllers: [IfController],
  providers: [IfService],
})
export class IfModule {}
