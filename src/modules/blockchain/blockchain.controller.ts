import { BadRequestException, Controller, Get, InternalServerErrorException, Post, Query } from '@nestjs/common';
import { GetBitcoinRateFromEthereumDTO } from './dtos/blockchain-get-eth-to-btc.dto';
import { BlockchainService } from './services/blockchain.service';
import { BlockchainGetBitcoinRateFromEthereumResponse } from './interfaces/blockchain-get-eth-to-btc.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SubscribeAlertDTO } from './dtos/subscribe-alert.dto';
import { PriceAlertSubscriberService } from '../email/services/price-alert-subscriber.service';
import { BlockchainPriceService } from './services/blockchain-price.service';
import { BlockchainPriceLogService } from './services/blockchain-price-log.service';
import { GetChainHistoryPriceDTO } from './dtos/blockchain-get-history-prices.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly blockchainPriceService: BlockchainPriceService,
    private readonly blockchainPriceLogService: BlockchainPriceLogService,
    private readonly priceAlertSubscriberService: PriceAlertSubscriberService,
  ) {}

  @ApiOperation({
    summary: 'Get history prices of chain',
    description: 'Get history prices of chain',
    tags: ['Blockchain'],
  })
  @Get('history')
  async getHistoryPrices(
    @Query() query: GetChainHistoryPriceDTO,
  ): Promise<{ price: number; date: Date; }[]> {
    const blockchainPrice = await this.blockchainPriceService.getBySymbol(query.chain);

    if (!blockchainPrice) {
      throw new BadRequestException('Chain not found');
    }

    const prices = await this.blockchainPriceLogService.getHistoryPrices(blockchainPrice.id, 24);

    return prices.map((price) => ({
      price: price.price,
      date: price.appliedAt,
    }));
  }

  @ApiOperation({
    summary: 'Get Bitcoin rate from Ethereum',
    description: 'Get Bitcoin rate from Ethereum',
    tags: ['Blockchain'],
  })
  @Get('eth-to-btc')
  async getEthToBtc(
    @Query() query: GetBitcoinRateFromEthereumDTO,
  ): Promise<BlockchainGetBitcoinRateFromEthereumResponse> {
    const [
      btc,
      eth,
    ] = await this.blockchainService.getUsdPrice(['BTC', 'ETH']);

    const totalUsdFromEth = query.amount * eth.price;
    const totalBtcFromEth = totalUsdFromEth / btc.price;
    const totalEthFromBtc = totalBtcFromEth / eth.price;
    const totalFeeInEth = totalEthFromBtc * this.blockchainService.getFeePercentage();

    return {
      btc: totalBtcFromEth.toFixed(32),
      feeInEthereum: totalFeeInEth.toFixed(32),
      feeInUsd: (totalUsdFromEth * this.blockchainService.getFeePercentage()).toFixed(32),
    };
  }

  @ApiOperation({
    summary: 'Subscribe alert notification for specific blockchain price',
    description: 'Subscribe alert notification for specific blockchain price',
    tags: ['Blockchain'],
  })
  @Post('subscribe-alert')
  async subscribeAlert(
    @Query() query: SubscribeAlertDTO,
  ): Promise<{ message: string; }> {
    let subscriber = await this.priceAlertSubscriberService.findOne(
      query.email,
      query.chain,
    );

    if (!!subscriber) {
      throw new BadRequestException('Subscriber already exists');
    }

    try {
      subscriber = await this.priceAlertSubscriberService.create(
        query.email,
        query.chain,
        query.price,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);;
    }
    
    return {
      message: 'Subscriber created successfully',
    };
  }
}

