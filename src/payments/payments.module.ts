import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YookassaModule } from './yookassa/yookassa.module';
import { HeleketModule } from './heleket/heleket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), YookassaModule, HeleketModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
