import { Test, TestingModule } from '@nestjs/testing';
import { PayoutRequestsService } from './payout-requests.service';

describe('PayoutRequestsService', () => {
  let service: PayoutRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayoutRequestsService],
    }).compile();

    service = module.get<PayoutRequestsService>(PayoutRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
