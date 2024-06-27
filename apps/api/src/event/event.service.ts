import { AppConfigService } from '@app/app-config/appConfig.service';
import { MailerService } from '@app/common/services/mailer.service';
import { EventType } from '@app/common/types/common.type';
import {
  MailCreateAccountEvent,
  MailEditAccountEvent,
  MailForgotPasswordEvent,
  MailInitPasswordEvent,
} from '@app/common/types/event.type';
import { BaseMail } from '@app/common/utils/baseMail.util';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @OnEvent(EventType.Mail.FORGOT_PASSWORD)
  async handlerMailForgotPasswordEvent({
    recipients,
    data,
  }: MailForgotPasswordEvent) {
    try {
      await this.mailerService.sendMail({
        recipients,
        subject: BaseMail.forgotPassword.subject,
        template: BaseMail.forgotPassword.template,
        context: {
          userNm: data.userNm,
          mailAddress: data.mailAddress,
          userId: data.userId,
          password: data.password,
          url: this.appConfigService.commonConfig.appUrl,
        },
      });
    } catch (error) {
      this.logger.error(`[forgotPassword] Fail to send mail cause ${error}`);
    }
  }

  @OnEvent(EventType.Mail.EDIT_ACCOUNT)
  async handlerMailEditAccountEvent({
    recipients,
    data,
    type,
  }: MailEditAccountEvent) {
    try {
      await this.mailerService.sendMail({
        recipients,
        subject: BaseMail.editAccount.subject,
        template: BaseMail.editAccount.template,
        context: {
          userNm: data.userNm,
          mailAddress: data.mailAddress,
          userId: data.userId,
          url: this.appConfigService.commonConfig.appUrl,
        },
      });
    } catch (error) {
      this.logger.error(`[${type}] Fail to send mail cause ${error}`);
    }
  }

  @OnEvent(EventType.Mail.CREATE_ACCOUNT)
  async handlerMailCreateAccountEvent({
    recipients,
    data,
  }: MailCreateAccountEvent) {
    try {
      await this.mailerService.sendMail({
        recipients,
        subject: BaseMail.createAccount.subject,
        template: BaseMail.createAccount.template,
        context: {
          userNm: data.userNm,
          mailAddress: data.mailAddress,
          userId: data.userId,
          password: data.password,
          isShowPassword: data.isShowPassword,
          url: this.appConfigService.commonConfig.appUrl,
        },
      });
    } catch (error) {
      this.logger.error(`[createAccount] Fail to send mail cause ${error}`);
    }
  }

  @OnEvent(EventType.Mail.INIT_PASSWORD)
  async handlerMailInitPasswordPasswordEvent({
    recipients,
    data,
  }: MailInitPasswordEvent) {
    try {
      await this.mailerService.sendMail({
        recipients,
        subject: BaseMail.initPassword.subject,
        template: BaseMail.initPassword.template,
        context: {
          userNm: data.userNm,
          userId: data.userId,
          password: data.password,
          url: this.appConfigService.commonConfig.appUrl,
        },
      });
    } catch (error) {
      this.logger.error(`[initPassword] Fail to send mail cause ${error}`);
    }
  }
}
