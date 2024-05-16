import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface EventWebhookAttributes {
  id: number;
  eventType: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface EventWebhookCreationAttributes extends Optional<EventWebhookAttributes, 'id'> {}

@Table({ tableName: 'EventWebhook' })
export default class EventWebhook extends Model<EventWebhookAttributes, EventWebhookCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @Column(DataType.STRING)
  eventType: string;

  @Column(DataType.STRING)
  url: string;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;
}
