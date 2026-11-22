
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderReport } from './order-report.entity';

@Entity('product_reports')
export class ProductReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_report_id: number;

  @Column()
  product_id: number;

  @Column()
  total_sold: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  profit: number;

  @ManyToOne(() => OrderReport, (order) => order.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_report_id' })
  orderReport: OrderReport;
}
