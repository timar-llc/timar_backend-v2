import { Test, TestingModule } from '@nestjs/testing';
import { RespondesController } from './respondes.controller';
import { RespondesService } from './respondes.service';

describe('RespondesController', () => {
  let controller: RespondesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RespondesController],
      providers: [RespondesService],
    }).compile();

    controller = module.get<RespondesController>(RespondesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
