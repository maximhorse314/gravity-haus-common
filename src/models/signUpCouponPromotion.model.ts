import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface SignUpCouponPromotionAttributes {
  id: number;
  term: number;
  active: boolean;
  pif: boolean;
  couponId: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
interface SignUpCouponPromotionCreationAttributes extends Optional<SignUpCouponPromotionAttributes, 'id'> {}

@Table({ tableName: 'SignUpCouponPromotion' })
export default class SignUpCouponPromotion extends Model implements SignUpCouponPromotionCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  term: number;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.BOOLEAN)
  pif: boolean;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  couponId: string;

  @Column(DataType.DATE)
  startDate: string;

  @Column(DataType.DATE)
  endDate: string;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;
}
