import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  sku: string;
  unitOfMeasure: string;
  unitCost: number;
  unitPrice: number;
  stripeProductId: string;
}
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

@Table({ tableName: 'Product' })
export default class Product extends Model implements ProductCreationAttributes {
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

  @Column(DataType.STRING)
  sku: string;

  @Column(DataType.STRING)
  stripeProductId: string;

  @Column(DataType.TEXT)
  unitOfMeasure: string;

  @Column(DataType.INTEGER)
  unitCost: number;

  @Column(DataType.INTEGER)
  unitPrice: number;
}
