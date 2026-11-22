import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProductReport } from './product-report.entity';

@Entity('orders_reports')
export class OrderReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_revenue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_cost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_profit: number;

  @OneToMany(() => ProductReport, (product) => product.orderReport)
  products: ProductReport[];
}
