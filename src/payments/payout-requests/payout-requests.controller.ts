import { Controller } from '@nestjs/common';
import { PayoutRequestsService } from './payout-requests.service';

@Controller('payout-requests')
export class PayoutRequestsController {
  constructor(private readonly payoutRequestsService: PayoutRequestsService) {}
}
