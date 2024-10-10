import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockchainService, GetUsdPrice } from '../services/blockchain.service';
import { BlockchainPriceLogService } from '../services/blockchain-price-log.service';
import { BlockchainPriceLog } from '../models/blockchain-price-log.model';
import { BlockchainPriceService } from '../services/blockchain-price.service';
import { BlockchainPrice } from '../models/blockchain-price.model';
import { PriceAlertSubscriberService } from 'src/modules/email/services/price-alert-subscriber.service';
import PromisePool from '@supercharge/promise-pool';
import { EmailService } from 'src/modules/email/services/email.service';
import { PriceAlertSubscriber } from 'src/modules/email/models/price-alert-subscriber.model';

@Injectable()
export class PriceAlertService {
  private readonly logger = new Logger(PriceAlertService.name);

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly blockchainPriceService: BlockchainPriceService,
    private readonly blockchainPriceLogService: BlockchainPriceLogService,
    private readonly emailService: EmailService,
    private readonly priceAlertSubscriberService: PriceAlertSubscriberService,
  ) {}

  @Cron('*/5 * * * *')
  async getLatestPrice(): Promise<void> {
    const [
      eth,
      matic,
      ethPrice,
      maticPrice,
    ]: [
      BlockchainPrice,
      BlockchainPrice,
      GetUsdPrice,
      GetUsdPrice,
    ] = await Promise.all([
      this.blockchainPriceService.getBySymbol('ETH'),
      this.blockchainPriceService.getBySymbol('MATIC'),
      this.blockchainService.getUsdPrice([
        'ETH',
        'MATIC',
      ]),
    ]).then(([eth, matic, [ethPrice, maticPrice]]) => ([
      eth,
      matic,
      ethPrice,
      maticPrice,
    ]));

    const priceLogs: BlockchainPriceLog[] = [
      BlockchainPriceLog.build({
        blockchainPriceId: eth.id,
        price: ethPrice.price,
        appliedAt: new Date(),
      }),
      BlockchainPriceLog.build({
        blockchainPriceId: matic.id,
        price: maticPrice.price,
        appliedAt: new Date(),
      }),
    ];

    eth.price = ethPrice.price;
    matic.price = maticPrice.price;

    await Promise.all([
      this.blockchainPriceService.bulkSave([eth, matic]),
      this.blockchainPriceLogService.bulkSave(priceLogs),
    ]);

    const histories = await Promise.all([
      this.blockchainPriceLogService.getHistoryPrices(eth.id, 1),
      this.blockchainPriceLogService.getHistoryPrices(matic.id, 1),
    ]);

    await PromisePool
      .for(histories)
      .process(async ([latest, previous]: [BlockchainPriceLog, BlockchainPriceLog]) => {
        const delta = Math.abs(latest.price - previous.price);

        if ((latest.price > previous.price) && ((delta / previous.price) * 100) >= 3) {
          await this.emailService.sendIncreasePriceAlertEmail(latest);
        }
      });

    const [
      ethSubscribers,
      maticSubscribers,
    ] = await Promise.all([
      this.priceAlertSubscriberService.findByChainPrice(eth.chain, eth.price),
      this.priceAlertSubscriberService.findByChainPrice(matic.chain, matic.price),
    ]);

    await Promise.all([
      PromisePool
        .for(ethSubscribers)
        .process(async (subscriber: PriceAlertSubscriber) => {
          await this.emailService.sendPriceAlertEmail(subscriber, eth);
          return this.priceAlertSubscriberService.delete(subscriber);
        }),
      PromisePool
        .for(maticSubscribers)
        .process(async (subscriber: PriceAlertSubscriber) => {
          await this.emailService.sendPriceAlertEmail(subscriber, matic);
          return this.priceAlertSubscriberService.delete(subscriber);
        }),
    ]);
  }
}
