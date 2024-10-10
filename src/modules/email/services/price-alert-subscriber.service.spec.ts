import { Test, TestingModule } from '@nestjs/testing';
import { PriceAlertSubscriberService } from './price-alert-subscriber.service';

describe('PriceAlertSubscriberService', () => {
  let service: PriceAlertSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceAlertSubscriberService],
    }).compile();

    service = module.get<PriceAlertSubscriberService>(PriceAlertSubscriberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
