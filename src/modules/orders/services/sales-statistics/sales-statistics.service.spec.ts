import { Test, TestingModule } from '@nestjs/testing';
import { SalesStatisticsService } from './sales-statistics.service';

describe('SalesStatisticsService', () => {
  let service: SalesStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesStatisticsService],
    }).compile();

    service = module.get<SalesStatisticsService>(SalesStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
