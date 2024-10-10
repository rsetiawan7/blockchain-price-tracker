import { Module } from '@nestjs/common';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { EmailModule } from './modules/email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './databases/sequelize-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    BlockchainModule,
  ],
  controllers: [],
  providers: [],
})
export class CommandModule {}
