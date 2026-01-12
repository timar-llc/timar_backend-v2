import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(
    userUuid: string,
    skip: number,
    take: number,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { user: { uuid: userUuid } },
      skip,
      order: {
        createdAt: 'DESC',
      },
      take,
    });
  }

  async findOne(uuid: string): Promise<Transaction> {
    return await this.transactionRepository.findOneOrFail({
      where: { uuid },
    });
  }

  async create(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }
}
