import { Test, TestingModule } from '@nestjs/testing';
import { RespondesService } from './respondes.service';

describe('RespondesService', () => {
  let service: RespondesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespondesService],
    }).compile();

    service = module.get<RespondesService>(RespondesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
