import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlockchainPriceLog } from '../models/blockchain-price-log.model';
import PromisePool from '@supercharge/promise-pool';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { startOfHour, subHours } from 'date-fns';

@Injectable()
export class BlockchainPriceLogService {
  constructor(
    @InjectModel(BlockchainPriceLog)
    private readonly blockchainPriceLogModel: typeof BlockchainPriceLog
  ) {}

  async getHistoryPrices(
    blockchainPriceId: number,
    hours: number,
  ): Promise<BlockchainPriceLog[]> {
    return this.blockchainPriceLogModel.findAll({
      attributes: [
        'price',
        'appliedAt',
      ],
      order: [
        ['appliedAt', 'DESC'],
      ],
      where: {
        blockchain_price_id: blockchainPriceId,
        applied_at: {
          [Op.gte]: startOfHour(subHours(new Date(), hours)),
          [Op.lte]: startOfHour(new Date()),
        }
      },
      group: [
        Sequelize.fn('EXTRACT', Sequelize.literal(`'hours' from applied_at`)),
        'price',
        'applied_at',
        'blockchain_price_id',
      ],
    })
  }

  async bulkSave(priceLogs: BlockchainPriceLog[]): Promise<void> {
    const tx = await this.blockchainPriceLogModel.sequelize.transaction();

    try {
      const { errors } = await PromisePool.for(priceLogs).process(async (priceLog) => {
        return priceLog.save({ transaction: tx });
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
