import { MailTemplate } from '../types/common.type';
import { MailDiv } from '../types/div.type';

export const BaseMail = {
  createAccount: {
    subject: '【routeX】アカウント登録完了のお知らせ',
    template: MailTemplate.CREATE_ACCOUNT,
    div: MailDiv.CREATE_ACCOUNT,
  },
  editAccount: {
    subject: '【routeX】アカウント更新完了のお知らせ',
    template: MailTemplate.EDIT_ACCOUNT,
    div: MailDiv.EDIT_ACCOUNT,
  },
  forgotPassword: {
    subject: '【routeX】パスワード再発行のお知らせ。',
    template: MailTemplate.FORGOT_PASSWORD,
    div: MailDiv.FORGOT_PASSWORD,
  },
  initPassword: {
    subject: '【routeX】パスワード初期化のお知らせ。',
    template: MailTemplate.INIT_PASSWORD,
    div: MailDiv.INIT_PASSWORD,
  },
};
