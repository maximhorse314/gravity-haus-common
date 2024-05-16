import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface EventBookingAttributes {
  id: number;
  userId: number;
  eventBookingStatus: string;
  user: User;
  eventId: number;

  bookingNotes: string;
  guests: number;
  participantId: number;
  paymentIntentId: string;
  refundId: string;

  createdAt: Date | string;
  updatedAt: Date | string;
}
interface EventBookingCreationAttributes extends Optional<EventBookingAttributes, 'id'> {}

@Table({ tableName: 'EventBooking' })
export default class EventBooking extends Model implements EventBookingCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column(DataType.STRING)
  eventBookingStatus: string;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column(DataType.INTEGER)
  eventId: number;

  @Column(DataType.STRING)
  bookingNotes: string;

  @Column(DataType.STRING)
  paymentIntentId: string;

  @Column(DataType.STRING)
  refundId: string;

  @Column(DataType.INTEGER)
  guests: number;

  @Column(DataType.INTEGER)
  participantId: number;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;
}
