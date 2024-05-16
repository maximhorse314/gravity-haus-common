import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

import Account from './account.model';

export interface ParticipantAttributes {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  accountId: number;
  userId: number;
  dateOfBirth: Date;
  active: number;
  user: User;
  account: Account;
}
interface ParticipantCreationAttributes extends Optional<ParticipantAttributes, 'id'> {}

@Table({ tableName: 'Participant' })
export default class Participant extends Model implements ParticipantCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  middleName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.INTEGER)
  accountId: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.INTEGER)
  active: number;

  @Column(DataType.DATE)
  dateOfBirth: Date;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Account, 'accountId')
  account: Account;
}
