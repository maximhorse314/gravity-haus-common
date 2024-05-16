import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, HasOne, AfterSave } from 'sequelize-typescript';
import syncData, { AllowedModels } from '../utils/sync-data/sync-data';

import Account from './account.model';

export interface PhoneAttributes {
  id: number;
  countryCode: string;
  number: number;
  account: Account;
}
interface PhoneCreationAttributes extends Optional<PhoneAttributes, 'id'> {}

@Table({ tableName: 'Phone' })
export default class Phone extends Model implements PhoneCreationAttributes {
  @AfterSave
  static async afterSaveHook(instance: Phone, options: any): Promise<void> {
    await syncData(AllowedModels.PHONE, instance, options);
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  number: number;

  @Column(DataType.STRING)
  countryCode: string;

  @HasOne(() => Account, 'phoneId')
  account: Account;
}
