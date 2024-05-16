import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface StripeAttributes {
  id: number;
  customerId: string;
  userId: number;
  user: User;
}
interface StripeCreationAttributes extends Optional<StripeAttributes, 'id'> {}

@Table({ tableName: 'Stripe' })
export default class Stripe extends Model implements StripeCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  customerId: string;

  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
