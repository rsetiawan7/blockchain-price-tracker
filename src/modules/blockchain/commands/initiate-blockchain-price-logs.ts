import { Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";
import { PromisePool } from "@supercharge/promise-pool";
import { startOfHour, subHours } from "date-fns";
import { BlockchainPriceService } from "../services/blockchain-price.service";
import { BlockchainService } from "../services/blockchain.service";
import { BlockchainPriceLog } from "../models/blockchain-price-log.model";
import { BlockchainPriceLogService } from "../services/blockchain-price-log.service";

@Command ({
  name: 'initiate-blockchain-price-logs',
  description: 'Initiate blockchain price logs',
})
export class InitiateBlockchainPriceLogsCommand extends CommandRunner {
  private readonly logger = new Logger(InitiateBlockchainPriceLogsCommand.name);

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly blockchainPriceService: BlockchainPriceService,
    private readonly blockchainPriceLogService: BlockchainPriceLogService,
  ) {
    super();
  }

  async run(passedArgs: string[], options?: any): Promise<void> {
    const numberOfBlockchains = await this.blockchainPriceService.count();

    if (numberOfBlockchains === 0) {
      this.logger.warn('No blockchains found, exiting...');
      return;
    }

    const now = new Date();
    const priceLogs: BlockchainPriceLog[] = [];
    const numberOfPages = Math.ceil(numberOfBlockchains / 10);
    const dates = Array.from({ length: 72 }, (_, k) => {
      return startOfHour(subHours(now, k));
    });

    for (let i = 1; i <= numberOfPages; i++) {
      const blockchainPrices = await this.blockchainPriceService.find(i, 10);

      if (blockchainPrices.length === 0) {
        this.logger.warn(`No blockchain prices found for page ${i}`);
        continue;
      }

      const { results } = await PromisePool
        .for(blockchainPrices)
        .process(async blockchainPrice => {
          return this.blockchainService.getTokenPriceByDates(
            blockchainPrice,
            dates,
          );
        });

      for (const logs of results) {
        priceLogs.push(...logs);
      }
    }

    await this.blockchainPriceLogService.bulkSave(priceLogs);
    return;
  }
}
