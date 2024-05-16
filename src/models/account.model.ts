import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo, HasMany, AfterSave } from 'sequelize-typescript';

import User from './user.model';
import Participant from './participant.model';
import Address from './address.model';
import Phone from './phone.model';
import syncData, { AllowedModels } from '../utils/sync-data/sync-data';

export interface AccountAttributes {
  id: number;
  userId: number;
  billingAddressId: number;
  mailingAddressId: number;
  phoneId: number;

  firstName: string;
  lastName: string;
  middleName: string;
  title: string;
  suffix: string;
  gender: string;
  emailOptIn: number;
  liabilityWaiver: number;

  dateOfBirth: string;
  handle: string;
  verified: number;
  preferredLocation: string;
  preferredIntensity: string;

  user: User;
  phone: Phone;
  participants: Participant[];
  billingAddress: Address;
  mailingAddress: Address;
}
interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

@Table({ tableName: 'Account' })
export default class Account extends Model implements AccountCreationAttributes {
  @AfterSave
  static async afterSaveHook(instance: Account, options: any): Promise<void> {
    await syncData(AllowedModels.ACCOUNT, instance, options);
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  middleName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  suffix: string;

  @Column(DataType.STRING)
  gender: string;

  @Column(DataType.STRING)
  handle: string;

  @Column(DataType.INTEGER)
  emailOptIn: number;

  @Column(DataType.INTEGER)
  liabilityWaiver: number;

  @Column(DataType.STRING)
  preferredLocation: string;

  @Column(DataType.STRING)
  preferredIntensity: string;

  @Column(DataType.DATE)
  dateOfBirth: string;

  @Column(DataType.TINYINT)
  verified: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column(DataType.INTEGER)
  billingAddressId: number;

  @BelongsTo(() => Address, 'billingAddressId')
  billingAddress: Address;

  @Column(DataType.INTEGER)
  mailingAddressId: number;

  @Column(DataType.INTEGER)
  phoneId: number;

  @BelongsTo(() => Phone, 'phoneId')
  phone: Phone;

  @BelongsTo(() => Address, 'mailingAddressId')
  mailingAddress: Address;

  @HasMany(() => Participant, 'accountId')
  participants: Participant[];
}
