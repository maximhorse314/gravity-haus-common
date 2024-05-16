import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface ActivityLogAttributes {
  id: number;
  userId: number;
  userEmail: string;
  action: string;
  result: string;
  requestData: string;
  resultData: string;
  dateCreated: Date | string;
  user: User;
}
interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, 'id'> {}

@Table({ tableName: 'ActivityLog' })
export default class ActivityLog extends Model implements ActivityLogCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.STRING)
  userEmail: string;

  @Column(DataType.STRING)
  action: string;

  @Column(DataType.STRING)
  result: string;

  @Column(DataType.STRING)
  requestData: string;

  @Column(DataType.STRING)
  resultData: string;

  @Column(DataType.DATE)
  dateCreated: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
