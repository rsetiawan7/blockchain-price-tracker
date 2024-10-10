import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PromisePool from '@supercharge/promise-pool';
import Moralis from 'moralis';
import { firstValueFrom, forkJoin, map, tap } from 'rxjs';
import { BlockchainPriceLog } from '../models/blockchain-price-log.model';
import { BlockchainPrice } from '../models/blockchain-price.model';
import { fromUnixTime } from 'date-fns';

interface GetBlockByDateResponse {
  date: string;
  block: number;
  timestamp: number;
  block_timestamp: string;
  hash: string;
  parent_hash: string;
}

export interface GetUsdPrice {
  symbol: string;
  price: number;
}

@Injectable()
export class BlockchainService {
  private moralisApiKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.moralisApiKey = this.config.get('MORALIS_API_KEY');
  }

  getFeePercentage(): number {
    return 0.03;
  }

  async getUsdPrice(symbols: string[]): Promise<GetUsdPrice[]> {
    const currencies = await Moralis.EvmApi.marketData.getTopCryptoCurrenciesByMarketCap().then((v) => v.raw);

    const prices: GetUsdPrice[] = [];
    const upperCaseSymbols = symbols.map((v) => v.toUpperCase());
    for (const currency of currencies) {
      if (!upperCaseSymbols.includes(currency.symbol.toUpperCase())) {
        continue;
      }

      prices.push({
        symbol: currency.symbol,
        price: +currency.usd_price,
      });

      if (prices.length === symbols.length) {
        break;
      }
    }

    return prices;
  }

  async getLatestBlockNumber(chain: string): Promise<number> {
    return firstValueFrom(this.http.get<string>(`https://deep-index.moralis.io/api/v2.2/latestBlockNumber/${chain}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': this.moralisApiKey,
      },
    })).then((v) => +v.data);
  }

  async getTokenPriceByDates(
    blockchainPrice: BlockchainPrice,
    dates: Date[],
  ): Promise<BlockchainPriceLog[]> {
    const { results } = await PromisePool
      .for(dates)
      .process(async (date) => {
        const data = await firstValueFrom(
          this.http.get<GetBlockByDateResponse>(`https://deep-index.moralis.io/api/v2.2/dateToBlock`, {
            params: {
              chain: blockchainPrice.chain,
              date: date.toISOString(),
            },
            headers: {
              'Accept': 'application/json',
              'X-API-Key': this.moralisApiKey,
            },
          }).pipe(
            tap({
              error: (e) => {
                console.error(e);
              },
            }),
          ),
        ).then((v) => v.data);

        const tokenPrice = await firstValueFrom(
          this.http.get<{ usdPrice: number; }>(`https://deep-index.moralis.io/api/v2.2/erc20/${blockchainPrice.contractAddress}/price`, {
            params: {
              chain: blockchainPrice.chain,
              toBlock: data.block,
            },
            headers: {
              'Accept': 'application/json',
              'X-API-Key': this.moralisApiKey,
            },
          }).pipe(
            tap({
              error: (e) => {
                console.error(e);
              },
            }),
          ),
        ).then((v) => v.data.usdPrice);

        return BlockchainPriceLog.build({
          blockchainPriceId: blockchainPrice.id,
          price: tokenPrice,
          appliedAt: fromUnixTime(data.timestamp),
        });
      });

    return results;
  }
}
