import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo, HasMany } from 'sequelize-typescript';

import User from './user.model';

export interface UserProfileDataAttributes {
  id: number;
  type: number;
  userId: number;
  profileImageUrl: string;
  bio: string;
  personalDescription: string;
  benefitsRating: string;
  favouriteLocations: string;
  favouriteOutdoorActivities: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
interface UserProfileDataCreationAttributes extends Optional<UserProfileDataAttributes, 'id'> {}

@Table({ tableName: 'UserProfileData' })
export default class UserProfileData extends Model implements UserProfileDataCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column(DataType.INTEGER)
  type: number;

  @Column(DataType.TEXT)
  profileImageUrl: string;

  @Column(DataType.TEXT)
  bio: string;

  @Column(DataType.STRING)
  personalDescription: string;

  @Column(DataType.STRING)
  benefitsRating: string;

  @Column(DataType.STRING)
  favouriteLocations: string;

  @Column(DataType.STRING)
  favouriteOutdoorActivities: string;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;
}
