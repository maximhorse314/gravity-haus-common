import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, HasOne, AfterSave } from 'sequelize-typescript';
import syncData, { AllowedModels } from '../utils/sync-data/sync-data';
import Account from './account.model';

export interface AddressAttributes {
  id: number;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  city: string;
  county: string;
  state: string;
  postalCode: string;
  country: string;
  mailingAccount?: Account;
  billingAccount?: Account;
}
interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

@Table({ tableName: 'Address' })
export default class Address extends Model implements AddressCreationAttributes {
  @AfterSave
  static async afterSaveHook(instance: Address, options: any): Promise<void> {
    await syncData(AllowedModels.ADDRESS, instance, options);
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  address1: string;

  @Column(DataType.STRING)
  address2: string;

  @Column(DataType.STRING)
  address3: string;

  @Column(DataType.STRING)
  address4: string;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.STRING)
  county: string;

  @Column(DataType.STRING)
  state: string;

  @Column(DataType.STRING)
  postalCode: string;

  @Column(DataType.STRING)
  country: string;

  @HasOne(() => Account, 'billingAddressId')
  billingAccount: Account;

  @HasOne(() => Account, 'mailingAddressId')
  mailingAccount: Account;
}
