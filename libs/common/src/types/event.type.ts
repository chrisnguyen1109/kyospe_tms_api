import { EmailRecipients } from '@azure/communication-email';

export interface MailForgotPasswordEvent {
  recipients: EmailRecipients;
  data: {
    userNm: string;
    mailAddress: string;
    userId: string;
    password: string;
  };
}

export interface MailEditAccountEvent {
  type: 'updateProfile' | 'editAccount';
  recipients: EmailRecipients;
  data: {
    userNm: string;
    mailAddress?: string;
    userId: string;
  };
}

export interface MailCreateAccountEvent {
  recipients: EmailRecipients;
  data: {
    userNm: string;
    mailAddress?: string;
    userId: string;
    password: string;
    isShowPassword: boolean;
  };
}

export interface MailInitPasswordEvent {
  recipients: EmailRecipients;
  data: {
    userNm: string;
    userId: string;
    password: string;
  };
}
