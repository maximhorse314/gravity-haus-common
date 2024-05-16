import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, HasOne, HasMany, Model, Table } from 'sequelize-typescript';

import StripePlanVersion from './stripePlanVersion.model';

export interface StripePlanAttributes {
  id: number;
  planId: string;
  name: string;
  interval: string;
  intervalCount: number;
  unitAmount: number;
  description: string;
  membershipPlan: string;
  membershipType: string;
  location: string;
  term: number;
  c1: boolean;
  stripePlanVersionId: number;
  createdAt: Date | string;
  updatedAt: Date | string;

  stripePlanVersion: StripePlanVersion;
}
interface StripePlanCreationAttributes extends Optional<StripePlanAttributes, 'id'> {}

@Table({ tableName: 'StripePlan' })
export default class StripePlan extends Model<StripePlanAttributes, StripePlanCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  stripePlanVersionId: number;

  @Column(DataType.INTEGER)
  intervalCount: number;

  @Column(DataType.STRING)
  planId: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  interval: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  membershipPlan: string;

  @Column(DataType.STRING)
  membershipType: string;

  @Column(DataType.STRING)
  location: string;

  @Column(DataType.INTEGER)
  term: number;

  @Column(DataType.BIGINT)
  unitAmount: number;

  @Column(DataType.BOOLEAN)
  c1: boolean;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;

  @BelongsTo(() => StripePlanVersion, 'stripePlanVersionId')
  stripePlanVersion: StripePlanVersion;
}
