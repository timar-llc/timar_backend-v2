import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  YookassaPaymentCallbackDto,
  YookassaPaymentRequestDto,
  YookassaPaymentResponseDto,
} from './dto/yookassa.dto';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class YookassaService {
  private readonly yookassaUrl: string;
  private readonly yookassaSecretKey: string;
  private readonly yookassaShopId: string;
  private readonly frontendPaymentSuccessUrl: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {
    this.yookassaUrl = this.configService.get('YOOKASSA_API_URL')!;
    this.yookassaSecretKey = this.configService.get('YOOKASSA_SECRET_KEY')!;
    this.yookassaShopId = this.configService.get('YOOKASSA_SHOP_ID')!;
    this.frontendPaymentSuccessUrl = this.configService.get(
      'FRONTEND_PAYMENT_SUCCESS_URL',
    )!;
  }

  async generateHead() {
    const head = {
      'Content-Type': 'application/json',
      'Idempotence-Key': crypto.randomUUID(),
    };
    return head;
  }

  async createPayment(data: YookassaPaymentRequestDto): Promise<string> {
    const head = await this.generateHead();
    const { amount, transactionUuid, paymentMethod } = data;
    console.log(`${this.yookassaUrl}/payments`);
    const response = await axios.post(
      `${this.yookassaUrl}/payments`,
      {
        amount: {
          value: amount * 1.035, // +3.5% комиссия yookassa,
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: this.frontendPaymentSuccessUrl,
        },
        payment_method: paymentMethod === 'sbp' && 'sbp',
        description: `Пополнение баланса TimarLance`,
        metadata: {
          transactionUuid: transactionUuid,
        },
      },
      {
        auth: {
          username: this.yookassaShopId,
          password: this.yookassaSecretKey,
        },
        headers: head,
      },
    );
    const result = response.data as YookassaPaymentResponseDto;
    return result.confirmation.confirmation_url;
  }

  async paymentsCallback(data: YookassaPaymentCallbackDto) {
    const { event, object } = data;
    const { metadata } = object;
    const { transactionUuid } = metadata;
    const transaction = await this.transactionRepository.findOne({
      where: { uuid: transactionUuid },
      relations: ['user'],
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with uuid ${transactionUuid} not found`,
      );
    }
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: transaction.user.uuid },
    });
    if (event === 'payment.succeeded' && transaction.status === 'pending') {
      console.log('payment.succeeded');
      transaction.status = 'completed';
      transaction.completedAt = new Date();

      // Convert decimal strings to numbers to avoid string concatenation
      const amountToAdd = Number(transaction.amount);
      const currentTotalBalance = Number(user.totalBalance || 0);
      const currentAvailableBalance = Number(user.availableBalance || 0);

      user.totalBalance = currentTotalBalance + amountToAdd;
      user.availableBalance = currentAvailableBalance + amountToAdd;

      await this.transactionRepository.save(transaction);
      await this.notificationsService.createSuccessPaymentNotification(
        amountToAdd,
        user.uuid,
      );
      await this.userRepository.save(user);
    }
    return data;
  }
}
