import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, HasOne, HasMany } from 'sequelize-typescript';
import MembershipApplication from './membershipApplication.model';
import UserMembership from './userMembership.model';

export interface SubscriptionAttributes {
  id: number;
  name: string;
  description: string;
  displayName: string;
  displayValue: string;
  displayValueCondition: string;
  displayValueInfo: string;
  displayInstruction: string;
  stripePlanId: string;
  stripePlanCurrentCoupon: string;
  stripePlanReferralCoupon: string;
  autoApprove: number;
  serviceId: number;
  productId: number;
  subscriptionTypeId: number;

  userMemberships: UserMembership[];
  membershipApplication: MembershipApplication;
}
interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id'> {}

@Table({ tableName: 'Subscription' })
export default class Subscription extends Model implements SubscriptionCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  displayName: string;

  @Column(DataType.STRING)
  displayValue: string;

  @Column(DataType.STRING)
  displayValueCondition: string;

  @Column(DataType.STRING)
  displayValueInfo: string;

  @Column(DataType.STRING)
  displayInstruction: string;

  @Column(DataType.TEXT)
  stripePlanId: string;

  @Column(DataType.STRING)
  stripePlanCurrentCoupon: string;

  @Column(DataType.STRING)
  stripePlanReferralCoupon: string;

  @Column(DataType.NUMBER)
  autoApprove: number;

  @Column(DataType.NUMBER)
  serviceId: number;

  @Column(DataType.NUMBER)
  productId: number;

  @Column(DataType.NUMBER)
  subscriptionTypeId: number;

  @HasOne(() => MembershipApplication, 'subscriptionId')
  membershipApplication: MembershipApplication;

  @HasMany(() => UserMembership, 'subscriptionId')
  userMemberships: UserMembership[];
}
