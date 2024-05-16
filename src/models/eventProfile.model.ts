import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface EventProfileAttributes {
  id: number;
  userId: number;
  interestIds: string;
  user: User;
  createdAt: Date;
}
interface EventProfileCreationAttributes extends Optional<EventProfileAttributes, 'id'> {}

@Table({ tableName: 'EventProfile' })
export default class EventProfile extends Model implements EventProfileCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column(DataType.STRING)
  interestIds: string;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;
}
