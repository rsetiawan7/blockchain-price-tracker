import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import Moralis from 'moralis';
import { BlockchainController } from './blockchain.controller';
import { PriceAlertService } from './tasks/price-alert.service';
import { BlockchainService } from './services/blockchain.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlockchainPrice } from './models/blockchain-price.model';
import { BlockchainPriceService } from './services/blockchain-price.service';
import { BlockchainPriceLogService } from './services/blockchain-price-log.service';
import { BlockchainPriceLog } from './models/blockchain-price-log.model';
import { EmailModule } from '../email/email.module';
import { PriceAlertSubscriberService } from '../email/services/price-alert-subscriber.service';
import { PriceAlertSubscriber } from '../email/models/price-alert-subscriber.model';
import { ConfigService } from '@nestjs/config';
import { InitiateBlockchainPriceLogsCommand } from './commands/initiate-blockchain-price-logs';

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([
      BlockchainPrice,
      BlockchainPriceLog,
      PriceAlertSubscriber,
    ]),
    EmailModule,
  ],
  exports: [
    SequelizeModule,
  ],
  controllers: [BlockchainController],
  providers: [
    PriceAlertService,
    BlockchainService,
    BlockchainPriceService,
    BlockchainPriceLogService,
    PriceAlertSubscriberService,
    InitiateBlockchainPriceLogsCommand,
  ],
})
export class BlockchainModule implements OnModuleInit {
  private moralisApiKey: string;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.moralisApiKey = this.config.get('MORALIS_API_KEY');
  }

  async onModuleInit() {
    await Moralis.start({
      apiKey: this.moralisApiKey,
    }).catch((e) => e);
  }
}
