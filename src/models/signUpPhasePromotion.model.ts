import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface SignUpPhasePromotionAttributes {
  id: number;
  term: number;
  active: boolean;
  pif: boolean;
  freeMonths: number;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
interface SignUpPhasePromotionCreationAttributes extends Optional<SignUpPhasePromotionAttributes, 'id'> {}

@Table({ tableName: 'SignUpPhasePromotion' })
export default class SignUpPhasePromotion extends Model implements SignUpPhasePromotionCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  term: number;

  @Column(DataType.INTEGER)
  freeMonths: number;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.BOOLEAN)
  pif: boolean;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.DATE)
  startDate: string;

  @Column(DataType.DATE)
  endDate: string;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;
}
