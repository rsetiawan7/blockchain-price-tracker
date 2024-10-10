import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainPriceService } from './blockchain-price.service';

describe('BlockchainPriceService', () => {
  let service: BlockchainPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainPriceService],
    }).compile();

    service = module.get<BlockchainPriceService>(BlockchainPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
