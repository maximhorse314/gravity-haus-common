import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import StripePlan from './stripePlan.model';

export interface StripePlanVersionAttributes {
  id: number;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;

  stripePlans: StripePlan[];
}
interface StripePlanVersionCreationAttributes extends Optional<StripePlanVersionAttributes, 'id'> {}

@Table({ tableName: 'StripePlanVersion' })
export default class StripePlanVersion extends Model<StripePlanVersionAttributes, StripePlanVersionCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;

  @HasMany(() => StripePlan, 'stripePlanVersionId')
  stripePlans: StripePlan[];
}
