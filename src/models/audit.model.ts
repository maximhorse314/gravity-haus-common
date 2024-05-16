import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface AuditAttributes {
  id: number;
  modelId: number;
  modelName: string;
  values: string;
  changedValues: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface AuditCreationAttributes extends Optional<AuditAttributes, 'id'> {}

@Table({ tableName: 'Audit' })
export default class Audit extends Model<AuditAttributes, AuditCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  modelId: number;

  @Column(DataType.STRING)
  modelName: string;

  @Column(DataType.TEXT)
  values: string;

  @Column(DataType.TEXT)
  changedValues: string;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;
}
