import { AppConfigService } from '@app/app-config/appConfig.service';
import { EmailClient } from '@azure/communication-email';
import { Injectable } from '@nestjs/common';
import { compile } from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import { MailTemplate, SendMailProps } from '../types/common.type';

@Injectable()
export class MailerService {
  private readonly emailClient?: EmailClient;

  constructor(private readonly appConfigService: AppConfigService) {
    const connectionString = this.appConfigService.mailconfig.connectionString;

    if (connectionString) {
      this.emailClient = new EmailClient(connectionString);
    }
  }

  async sendMail(sendMailProps: SendMailProps) {
    if (!this.emailClient) {
      return;
    }

    const { recipients, subject, template, context } = sendMailProps;
    const html = await this.getMailContent(template, context);

    const poller = await this.emailClient.beginSend({
      senderAddress: this.appConfigService.mailconfig.from ?? '',
      content: {
        subject,
        html,
      },
      recipients,
    });

    return poller.pollUntilDone();
  }

  private async getMailContent(
    template: MailTemplate,
    context?: Record<string, any>,
  ) {
    const mailTemplate = await fs.readFile(
      path.join(__dirname, `./views/mails/${template}.hbs`),
    );

    const compiled = compile(mailTemplate.toString());

    return compiled(context);
  }
}
