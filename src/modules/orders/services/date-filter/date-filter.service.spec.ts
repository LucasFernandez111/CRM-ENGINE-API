import { Test, TestingModule } from '@nestjs/testing';
import { DateFilterService } from './date-filter.service';

describe('DateFilterService', () => {
  let service: DateFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateFilterService],
    }).compile();

    service = module.get<DateFilterService>(DateFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
