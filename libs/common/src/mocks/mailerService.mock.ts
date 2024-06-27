import { createMock } from '@golevelup/ts-jest';
import { MailerService } from '../services/mailer.service';

export const mailerServiceMock = createMock<MailerService>({
  sendMail: jest.fn().mockResolvedValue({}),
});
