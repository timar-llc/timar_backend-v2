import { Test, TestingModule } from '@nestjs/testing';
import { PayoutRequestsController } from './payout-requests.controller';
import { PayoutRequestsService } from './payout-requests.service';

describe('PayoutRequestsController', () => {
  let controller: PayoutRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayoutRequestsController],
      providers: [PayoutRequestsService],
    }).compile();

    controller = module.get<PayoutRequestsController>(PayoutRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
