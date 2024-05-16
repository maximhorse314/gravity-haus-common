import { Optional } from 'sequelize';
import { HasMany, Table, Model, Column, DataType } from 'sequelize-typescript';

import User from './user.model';

export interface RoleAttributes {
  id: number;
  description: string;
  name: string;
  users: User[];
}
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

@Table({ tableName: 'Role' })
export default class Role extends Model implements RoleCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  description: string;

  @HasMany(() => User, 'roleId')
  users: User[];
}
