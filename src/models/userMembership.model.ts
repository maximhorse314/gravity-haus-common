import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo, AfterSave } from 'sequelize-typescript';
import Subscription from './subscription.model';

import User from './user.model';

import syncData, { AllowedModels } from '../utils/sync-data/sync-data';

export interface UserMembershipAttributes {
  id: number;
  subscriptionId: string;
  userId: number;
  user: User;
  subscription: Subscription;
}
interface UserMembershipCreationAttributes extends Optional<UserMembershipAttributes, 'id'> {}

@Table({ tableName: 'UserMembership' })
export default class UserMembership extends Model implements UserMembershipCreationAttributes {
  @AfterSave
  static async afterSaveHook(instance: UserMembership, options: any): Promise<void> {
    await syncData(AllowedModels.USER_MEMBERSHIP, instance, options);
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.STRING)
  subscriptionId: string;

  @BelongsTo(() => Subscription, 'subscriptionId')
  subscription: Subscription;

  @BelongsTo(() => User, 'userId')
  user: User;
}
