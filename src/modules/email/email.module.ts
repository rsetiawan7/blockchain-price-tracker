import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PriceAlertSubscriber } from './models/price-alert-subscriber.model';
import { PriceAlertSubscriberService } from './services/price-alert-subscriber.service';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PriceAlertSubscriber])
  ],
  controllers: [],
  providers: [PriceAlertSubscriberService, EmailService],
  exports: [
    SequelizeModule,
    PriceAlertSubscriberService,
  ],
})
export class EmailModule {}
