import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, HasMany, HasOne, BelongsTo } from 'sequelize-typescript';
import MembershipApplicationStatus from './membershipApplicationStatus.model';
import Subscription from './subscription.model';

export interface MembershipApplicationAttributes {
  id: number;
  formId: number;
  subscriptionId: number;
  subscription: Subscription;
  membershipApplicationStatuses: MembershipApplicationStatus[];
}
interface MembershipApplicationCreationAttributes extends Optional<MembershipApplicationAttributes, 'id'> {}

@Table({ tableName: 'MembershipApplication' })
export default class MembershipApplication extends Model<
  MembershipApplicationAttributes,
  MembershipApplicationCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  formId: number;

  @Column(DataType.STRING)
  subscriptionId: string;

  @BelongsTo(() => Subscription, 'subscriptionId')
  subscription: Subscription;

  @HasMany(() => MembershipApplicationStatus, 'applicationId')
  membershipApplicationStatuses: MembershipApplicationStatus[];
}
