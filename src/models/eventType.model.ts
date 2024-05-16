import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

export interface EventTypeAttributes {
  id: number;
  name: string;

  description: string;
  imageUrl: string;

  status: number;
  displayOrder: number;
  displayType: number;
  isForNotification: number;

  createdAt: Date;
  updatedAt: Date;
}
interface EventTypeCreationAttributes extends Optional<EventTypeAttributes, 'id'> {}

@Table({ tableName: 'EventType' })
export default class EventType extends Model implements EventTypeCreationAttributes {
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
  imageUrl: string;

  @Column(DataType.INTEGER)
  status: number;

  @Column(DataType.INTEGER)
  displayOrder: number;

  @Column(DataType.INTEGER)
  displayType: number;

  @Column(DataType.INTEGER)
  isForNotification: number;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
