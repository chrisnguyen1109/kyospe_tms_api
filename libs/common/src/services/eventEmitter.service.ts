import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventType } from '../types/common.type';
import {
  MailCreateAccountEvent,
  MailEditAccountEvent,
  MailForgotPasswordEvent,
  MailInitPasswordEvent,
} from '../types/event.type';

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  sendForgotPasswordMail(payload: MailForgotPasswordEvent) {
    return this.eventEmitter.emit(EventType.Mail.FORGOT_PASSWORD, payload);
  }

  sendEditAccountMail(payload: MailEditAccountEvent) {
    return this.eventEmitter.emit(EventType.Mail.EDIT_ACCOUNT, payload);
  }

  sendCreateAccountMail(payload: MailCreateAccountEvent) {
    return this.eventEmitter.emit(EventType.Mail.CREATE_ACCOUNT, payload);
  }

  sendInitPasswordMail(payload: MailInitPasswordEvent) {
    return this.eventEmitter.emit(EventType.Mail.INIT_PASSWORD, payload);
  }
}
