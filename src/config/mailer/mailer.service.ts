import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }
  async sendRegistrationEmail(email: string, code: string) {
    const message = {
      from: `TimarLance`,
      to: email,
      subject: 'Your registration code in Timar',
      text: `Your registration code is: ${code}`,
    };
    await this.transporter.sendMail(message);
  }
  async sendResetPasswordEmail(email: string, code: string) {
    const message = {
      from: `"TimarLance" <${this.configService.get('SMTP_USER')}>`,

      to: email,
      subject: 'Your reset password code in Timar',
      text: `Your reset password code is: ${code}`,
    };
    await this.transporter.sendMail(message);
  }
}
