import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface HausReservationsAttributes {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  user: User;
  confirmation_code: string;
  deposit: number; // float
  stay_value: number; // float
  to: Date;
  from: Date;
  rate_code: number;
  room_type: number;
  haus_id: number;
}

interface HausReservationsCreationAttributes extends Optional<HausReservationsAttributes, 'id'> {}

@Table({ tableName: 'HausReservations' })
export default class HausReservations extends Model implements HausReservationsCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  // tslint:disable-next-line:variable-name
  user_id: number;

  @Column(DataType.DATE)
  // tslint:disable-next-line:variable-name
  created_at: Date;

  @Column(DataType.DATE)
  // tslint:disable-next-line:variable-name
  updated_at: Date;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @Column(DataType.STRING)
  // tslint:disable-next-line:variable-name
  confirmation_code: string;

  @Column(DataType.FLOAT)
  deposit: number; // float

  @Column(DataType.FLOAT)
  // tslint:disable-next-line:variable-name
  stay_value: number; // float

  @Column(DataType.DATE)
  to: Date;

  @Column(DataType.DATE)
  from: Date;

  @Column(DataType.NUMBER)
  // tslint:disable-next-line:variable-name
  rate_code: number;

  @Column(DataType.NUMBER)
  // tslint:disable-next-line:variable-name
  room_type: number;

  @Column(DataType.NUMBER)
  // tslint:disable-next-line:variable-name
  haus_id: number;
}
