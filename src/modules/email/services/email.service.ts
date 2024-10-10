import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { BlockchainPriceLog } from 'src/modules/blockchain/models/blockchain-price-log.model';
import { PriceAlertSubscriber } from '../models/price-alert-subscriber.model';
import { BlockchainPrice } from 'src/modules/blockchain/models/blockchain-price.model';

@Injectable()
export class EmailService implements OnApplicationBootstrap {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly config: ConfigService,
  ) {}

  onApplicationBootstrap() {
    this.transporter = nodemailer.createTransport({
      secure: this.config.get('EMAIL_USE_SSL'),
      host: this.config.get('EMAIL_HOST'),
      port: this.config.get('EMAIL_PORT', { infer: true }),
      sender: this.config.get('EMAIL_SENDER_ADDRESS'),
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASS'),
      },
    });

    this.transporter.verify((err, success) => {
      if (success) {
        console.info('e-mail transporter authenticated successfully');
      } else {
        console.error(err);
      }
    });
  }

  async sendIncreasePriceAlertEmail(
    blockchainPriceLog: BlockchainPriceLog,
  ): Promise<void> {
    const { blockchainPrice } = blockchainPriceLog;

    this.transporter.sendMail({
      from: `Rachmad Setiawan <rsetiawan7@gmail.com>`,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: 'Price Increase Alert',
      html: `Alert! Price of ${blockchainPrice.name} (${blockchainPrice.symbol}) is now $${blockchainPrice.price.toFixed(2)}.`,
    });
  }

  async sendPriceAlertEmail(
    subscriber: PriceAlertSubscriber,
    blockchainPrice: BlockchainPrice,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `Rachmad Setiawan <rsetiawan7@gmail.com>`,
      to: subscriber.email,
      subject: 'Price Reached Alert',
      html: `Alert! Price of ${blockchainPrice.name} (${blockchainPrice.symbol}) is reached to $${blockchainPrice.price.toFixed(2)}.`,
    });
  }
}
