import {
  AppEventPattern,
  AppMessagePattern,
} from '@app/common/types/common.type';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { IfService } from './if.service';

@Controller()
export class IfController {
  constructor(private readonly ifService: IfService) {}

  @MessagePattern(AppMessagePattern.Batch.IMPORT_BASE)
  importMBase() {
    return this.ifService.manualImportIfMBase();
  }

  @MessagePattern(AppMessagePattern.Batch.IMPORT_SLIP)
  importSlip() {
    return this.ifService.manualImportIfSlip();
  }

  @EventPattern(AppEventPattern.Batch.EXPORT_SIGN)
  exportSign() {
    return this.ifService.manualExportIfSign();
  }
}
