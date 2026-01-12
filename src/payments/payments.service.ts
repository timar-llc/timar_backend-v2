import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionsService } from './transactions/transactions.service';
import { TopUpDto } from './dto/top-up.dto';
import { Transaction } from './transactions/entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { YookassaService } from './yookassa/yookassa.service';
import { HeleketService } from './heleket/heleket.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly yookassaService: YookassaService,
    private readonly heleketService: HeleketService,
  ) {}

  async topUpBalance(userUuid: string, topUpDto: TopUpDto): Promise<string> {
    const transaction = this.transactionRepository.create({
      user: { uuid: userUuid },
      amount: topUpDto.amount,
      amountWithCommission: topUpDto.amountWithCommission,
      paymentMethod: topUpDto.paymentMethod,
      type: 'deposit',
      status: 'pending',
    });
    await this.transactionRepository.save(transaction);
    if (topUpDto.paymentMethod === 'card' || topUpDto.paymentMethod === 'sbp') {
      return this.yookassaService.createPayment({
        amount: topUpDto.amountWithCommission,
        transactionUuid: transaction.uuid,
        paymentMethod: topUpDto.paymentMethod,
      });
    }
    if (topUpDto.paymentMethod === 'crypto') {
      //   return this.heleketService.createPayment(transaction);
      return 'https://example.com';
    } else {
      throw new BadRequestException('Invalid payment method');
    }
  }
}
