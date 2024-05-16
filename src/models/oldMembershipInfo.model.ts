import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface OldMembershipInfoAttributes {
  id: number;
  membershipName: string;
  replacementName: string;
}
interface OldMembershipInfoCreationAttributes extends Optional<OldMembershipInfoAttributes, 'id'> {}

@Table({ tableName: 'OldMembershipInfo' })
export default class OldMembershipInfo extends Model implements OldMembershipInfoCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  membershipName: string;

  @Column(DataType.STRING)
  replacementName: string;
}
