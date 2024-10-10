import { Column, CreatedAt, DataType, HasOne, Model, Table, UpdatedAt } from "sequelize-typescript";
import { BlockchainPrice } from "./blockchain-price.model";

@Table({
  tableName: 'blockchain_price_logs',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: false,
})
export class BlockchainPriceLog extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'blockchain_price_id' })
  blockchainPriceId: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'price' })
  price: number;

  @Column({ type: DataType.DATE, allowNull: false, field: 'applied_at' })
  appliedAt: Date;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasOne(() => BlockchainPrice, 'id')
  blockchainPrice?: BlockchainPrice;
}