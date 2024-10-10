import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PriceAlertSubscriber } from '../models/price-alert-subscriber.model';
import { Op } from 'sequelize';

@Injectable()
export class PriceAlertSubscriberService {
  constructor(
    @InjectModel(PriceAlertSubscriber)
    private readonly priceAlertSubscriberModel: typeof PriceAlertSubscriber,
  ) {}

  async findOne(
    email: string,
    chain: string,
  ): Promise<PriceAlertSubscriber> {
    return this.priceAlertSubscriberModel.findOne({
      where: {
        email,
        chain,
      },
    });
  }

  async findByChainPrice(
    chain: string,
    priceUpperThreshold: number,
  ): Promise<PriceAlertSubscriber[]> {
    return this.priceAlertSubscriberModel.findAll({
      where: {
        chain,
        price: {
          [Op.lte]: priceUpperThreshold,
        },
      },
    });
  }

  async create(
    email: string,
    chain: string,
    price: number,
  ): Promise<PriceAlertSubscriber> {
    return this.priceAlertSubscriberModel.create({
      email,
      chain,
      price,
      hasAlerted: false,
    });
  }

  async delete(
    subscriber: PriceAlertSubscriber
  ): Promise<void> {
    subscriber.destroy();
  }
}
