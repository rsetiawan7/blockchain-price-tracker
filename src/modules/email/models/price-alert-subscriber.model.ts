import { Column, CreatedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: 'price_alert_subscribers',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: false,
})
export class PriceAlertSubscriber extends Model {
  @Column({ primaryKey: true, autoIncrement: true, field: 'id' })
  id: number;

  @Column({ allowNull: false, field: 'email' })
  email: string;

  @Column({ allowNull: false, field: 'chain' })
  chain: string;

  @Column({ allowNull: false, field: 'price' })
  price: number;

  @Column({ allowNull: false, defaultValue: false, field: 'has_alerted' })
  hasAlerted: boolean;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}