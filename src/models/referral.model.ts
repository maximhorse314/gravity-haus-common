import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, HasOne } from 'sequelize-typescript';

export interface ReferralAttributes {
  id: number;
  recipientUserId: number;
  recipientEmail: string;
  coupon: string;
  stripePlanId: string;
  stripeToken: string;
  status: number;

  referrerUserId?: number;
  referrerEmail?: string;
  couponId?: number;
  noteForRecipient?: string;
  createdBy?: number;
  lastUpdatedBy?: number;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
interface ReferralCreationAttributes extends Optional<ReferralAttributes, 'id'> {}

@Table({ tableName: 'Referral' })
export default class Referral extends Model implements ReferralCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  referrerUserId: number;

  @Column(DataType.STRING)
  referrerEmail: string;

  @Column(DataType.INTEGER)
  recipientUserId: number;

  @Column(DataType.INTEGER)
  recipientEmail: string;

  @Column(DataType.INTEGER)
  couponId: number;

  @Column(DataType.STRING)
  coupon: string;

  @Column(DataType.STRING)
  stripePlanId: string;

  @Column(DataType.STRING)
  stripeToken: string;

  @Column(DataType.STRING)
  noteForRecipient: string;

  @Column(DataType.STRING)
  status: number;

  @Column(DataType.INTEGER)
  createdBy: number;

  @Column(DataType.INTEGER)
  lastUpdatedBy: number;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  lastUpdatedAt: Date;
}
