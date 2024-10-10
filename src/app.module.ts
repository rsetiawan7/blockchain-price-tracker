import { Module } from '@nestjs/common';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { EmailModule } from './modules/email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './databases/sequelize-config.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ScheduleModule.forRoot(),
    BlockchainModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
