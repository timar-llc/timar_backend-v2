import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  constructor() {}
  async sendLoginSms(phone: string, code: string) {
    const message = {
      from: `"No Reply"`,
      to: phone,
      subject: 'Your login code in Timar',
      text: `Your login code is: ${code}`,
    };
    console.log(message);
  }
  async sendRegistrationSms(phone: string, code: string) {
    const message = {
      from: `"No Reply"`,
      to: phone,
      subject: 'Your registration code in Timar',
      text: `Your registration code is: ${code}`,
    };
    console.log(message);
  }
  async sendResetPasswordSms(phone: string, code: string) {
    const message = {
      from: `"No Reply"`,
      to: phone,
      subject: 'Your reset password code in Timar',
      text: `Your reset password code is: ${code}`,
    };
    console.log(message);
  }
}
