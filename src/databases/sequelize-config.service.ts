import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    private readonly config: ConfigService,
  ) {}

  createSequelizeOptions(connectionName?: string): Promise<SequelizeModuleOptions> | SequelizeModuleOptions {
    return {
      name: connectionName,
      dialect: 'postgres',
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT', { infer: true }),
      username: this.config.get('DB_USERNAME'),
      password: this.config.get('DB_PASSWORD'),
      database: this.config.get('DB_NAME'),
      autoLoadModels: true,
      synchronize: false,
    };
  }
}