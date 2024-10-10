import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlockchainPrice } from '../models/blockchain-price.model';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class BlockchainPriceService {
  constructor(
    @InjectModel(BlockchainPrice)
    private readonly blockchainPriceModel: typeof BlockchainPrice,
  ) {}

  async count(): Promise<number> {
    return this.blockchainPriceModel.count();
  }

  async find(
    page: number,
    perPage: number,
  ): Promise<BlockchainPrice[]> {
    return this.blockchainPriceModel.findAll({
      offset: (page - 1) * perPage,
      limit: perPage,
      order: [
        ['id', 'ASC'],
      ],
    });
  }

  async getBySymbol(
    chain: string
  ): Promise<BlockchainPrice> {
    return this.blockchainPriceModel.findOne({
      where: {
        symbol: chain,
      },
    });
  }

  async bulkSave(prices: BlockchainPrice[]): Promise<void> {
    const tx = await this.blockchainPriceModel.sequelize.transaction();

    try {
      const { errors } = await PromisePool.for(prices).process(async (price) => {
        return price.save({ transaction: tx });
      });

      if (errors.length > 0) {
        throw errors;
      }

      await tx.commit();
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }
}
