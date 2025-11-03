import { Module } from '@nestjs/common';
import { PayoutRequestsService } from './payout-requests.service';
import { PayoutRequestsController } from './payout-requests.controller';

@Module({
  controllers: [PayoutRequestsController],
  providers: [PayoutRequestsService],
})
export class PayoutRequestsModule {}
