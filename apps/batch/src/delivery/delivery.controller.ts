import { AppEventPattern } from '@app/common/types/common.type';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @EventPattern(AppEventPattern.Batch.CONFIRM_ACTUAL)
  confirmActualData() {
    return this.deliveryService.manualConfirmActualData();
  }

  @EventPattern(AppEventPattern.Batch.ASSIGN_COURSE)
  assignCourse() {
    return this.deliveryService.manualAssignCourse();
  }
}
