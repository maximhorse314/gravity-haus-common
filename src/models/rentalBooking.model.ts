import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface RentalBookingAttributes {
  id: number;
  userId: number;
  cancelled: number;
  user: User;

  createdAt: Date;
  updatedAt: Date;

  thirdPartyId: string;
  thirdPartyName: string;
  categoryName: string;

  expectedDropoffHour: number;
  expectedDropoffMinute: number;
  expectedPickupHour: number;
  expectedPickupMinute: number;
  rentalProductVariantId: number;
  rentalProductItemId: number;
  rentalProductId: number;
  rentalLocationId: number;
  rentalTypeId: number;
  status: number;
  quantity: number;
  returnStatus: number;
  checkedOutBy: number;
  checkedInBy: number;
  alternatePickupLocationId: number;
  alternateDropoffLocationId: number;
  pickupLockerId: number;
  dropOfflLockerId: number;

  startTime: Date;
  endTime: Date;
  checkedInAt: Date;
  returnedDate: Date;
  checkedOutAt: Date;
}

interface RentalBookingCreationAttributes extends Optional<RentalBookingAttributes, 'id'> {}

@Table({ tableName: 'RentalBooking' })
export default class RentalBooking extends Model implements RentalBookingCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.INTEGER)
  cancelled: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.STRING)
  thirdPartyId: string;

  @Column(DataType.STRING)
  thirdPartyName: string;

  @Column(DataType.STRING)
  categoryName: string;

  @Column(DataType.NUMBER)
  expectedDropoffHour: number;

  @Column(DataType.NUMBER)
  expectedDropoffMinute: number;

  @Column(DataType.NUMBER)
  expectedPickupHour: number;

  @Column(DataType.NUMBER)
  expectedPickupMinute: number;

  @Column(DataType.NUMBER)
  rentalProductVariantId: number;

  @Column(DataType.NUMBER)
  rentalProductItemId: number;

  @Column(DataType.NUMBER)
  rentalProductId: number;

  @Column(DataType.NUMBER)
  rentalLocationId: number;

  @Column(DataType.NUMBER)
  rentalTypeId: number;

  @Column(DataType.NUMBER)
  status: number;

  @Column(DataType.NUMBER)
  quantity: number;

  @Column(DataType.NUMBER)
  returnStatus: number;

  @Column(DataType.NUMBER)
  checkedOutBy: number;

  @Column(DataType.NUMBER)
  checkedInBy: number;

  @Column(DataType.NUMBER)
  alternatePickupLocationId: number;

  @Column(DataType.NUMBER)
  alternateDropoffLocationId: number;

  @Column(DataType.NUMBER)
  pickupLockerId: number;

  @Column(DataType.NUMBER)
  dropOfflLockerId: number;

  @Column(DataType.DATE)
  startTime: Date;
  @Column(DataType.DATE)
  endTime: Date;
  @Column(DataType.DATE)
  checkedInAt: Date;
  @Column(DataType.DATE)
  returnedDate: Date;
  @Column(DataType.DATE)
  checkedOutAt: Date;
}
