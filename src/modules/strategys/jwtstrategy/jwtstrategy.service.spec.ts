import { Test, TestingModule } from '@nestjs/testing';
import { JwtstrategyService } from './jwtstrategy.service';

describe('JwtstrategyService', () => {
  let service: JwtstrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtstrategyService],
    }).compile();

    service = module.get<JwtstrategyService>(JwtstrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
