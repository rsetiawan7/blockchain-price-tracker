import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainPriceLogService } from './blockchain-price-log.service';

describe('BlockchainPriceLogService', () => {
  let service: BlockchainPriceLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainPriceLogService],
    }).compile();

    service = module.get<BlockchainPriceLogService>(BlockchainPriceLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
