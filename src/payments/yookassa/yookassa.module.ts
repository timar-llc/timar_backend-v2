import { Module } from '@nestjs/common';
import { YookassaService } from './yookassa.service';
import { YookassaController } from './yookassa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User]), NotificationsModule],
  controllers: [YookassaController],
  providers: [YookassaService],
  exports: [YookassaService],
})
export class YookassaModule {}
