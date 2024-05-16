import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';
import GymLocation from './gymLocation.model';

export interface GymBookingAttributes {
  id: number;
  locationId: number;
  userId: number;
  isCancel: number;
  user: User;
  location: GymLocation;
  createdAt: Date;
  updatedAt: Date;

  type: string;
  categoryId: number;
  bookingId: number;
  thirdPartyId: number;
  startDateTime: Date;
  endDateTime: Date;
}
interface GymBookingCreationAttributes extends Optional<GymBookingAttributes, 'id'> {}

@Table({ tableName: 'GymBooking' })
export default class GymBooking extends Model implements GymBookingCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  locationId: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.INTEGER)
  isCancel: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => GymLocation, 'locationId')
  location: GymLocation;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.STRING)
  type: string;

  @Column(DataType.NUMBER)
  categoryId: number;

  @Column(DataType.NUMBER)
  bookingId: number;

  @Column(DataType.NUMBER)
  thirdPartyId: number;

  @Column(DataType.DATE)
  startDateTime: Date;

  @Column(DataType.DATE)
  endDateTime: Date;
}
