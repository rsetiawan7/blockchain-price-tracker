import { CommandFactory } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { CommandModule } from './cli.module';

async function bootstrap() {
  await CommandFactory.run(CommandModule, {
    logger: ['error', 'warn'],
  });

  // or, if you only want to print Nest's warnings and errors
  await CommandFactory.run(CommandModule);
}

bootstrap();