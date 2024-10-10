import { Column, CreatedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { BlockchainPriceLog } from "./blockchain-price-log.model";

@Table({
  tableName: 'blockchain_prices',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: false,
})
export class BlockchainPrice extends Model {
  @Column({ primaryKey: true, autoIncrement: true, field: 'id' })
  id: number;

  @Column({ allowNull: false, field: 'name' })
  name: string;

  @Column({ allowNull: false, field: 'contract_address' })
  contractAddress: string;

  @Column({ allowNull: false, unique: true, field: 'symbol' })
  symbol: string;

  @Column({ allowNull: false, field: 'chain' })
  chain: string;

  @Column({ allowNull: false, field: 'exchange' })
  exchange: string;

  @Column({ allowNull: false, field: 'price' })
  price: number;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => BlockchainPriceLog, 'blockchainPriceId')
  logs?: BlockchainPriceLog[]
}