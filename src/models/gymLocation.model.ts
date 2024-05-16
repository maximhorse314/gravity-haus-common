import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';

import GymBooking from './gymBooking.model';

export interface GymLocationAttributes {
  id: number;
  locationType: number;
  bookings: GymBooking;

  address: string;
  businessDescription: string; // text
  description: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  locationName: string;
  phone: string;
  phoneExtension: string;
  zipCode: string;
  thirdPartySiteId: string;
  stateProvCode: string;
  state: string;
  openTime: string;
  closeTime: string;
  openDays: string;
  imageLocationUrl: string;
  user: string;
  code: string;
  apiKey: string;
  token: string;
  baseUrl: string;
  timezone: string;
  isSubLocation: number;
  displayOrder: number;
  locationStatus: number;
  hasClasses: number;
}

interface GymLocationCreationAttributes extends Optional<GymLocationAttributes, 'id'> {}

@Table({ tableName: 'GymLocation' })
export default class GymLocation extends Model implements GymLocationCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  locationType: number;

  @HasMany(() => GymBooking, 'locationId')
  bookings: GymBooking;

  @Column(DataType.STRING)
  address: string;

  @Column(DataType.TEXT)
  businessDescription: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.STRING)
  country: string;

  @Column(DataType.STRING)
  latitude: string;

  @Column(DataType.STRING)
  longitude: string;

  @Column(DataType.STRING)
  locationName: string;

  @Column(DataType.STRING)
  phone: string;

  @Column(DataType.STRING)
  phoneExtension: string;

  @Column(DataType.STRING)
  zipCode: string;

  @Column(DataType.STRING)
  thirdPartySiteId: string;

  @Column(DataType.STRING)
  stateProvCode: string;

  @Column(DataType.STRING)
  state: string;

  @Column(DataType.STRING)
  openTime: string;

  @Column(DataType.STRING)
  closeTime: string;

  @Column(DataType.STRING)
  openDays: string;

  @Column(DataType.STRING)
  imageLocationUrl: string;

  @Column(DataType.STRING)
  user: string;

  @Column(DataType.STRING)
  code: string;

  @Column(DataType.STRING)
  apiKey: string;

  @Column(DataType.STRING)
  token: string;

  @Column(DataType.STRING)
  baseUrl: string;

  @Column(DataType.STRING)
  timezone: string;

  @Column(DataType.INTEGER)
  isSubLocation: number;

  @Column(DataType.INTEGER)
  displayOrder: number;

  @Column(DataType.INTEGER)
  locationStatus: number;

  @Column(DataType.INTEGER)
  hasClasses: number;
}
