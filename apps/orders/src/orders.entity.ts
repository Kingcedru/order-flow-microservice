import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryColumn('uuid')
  orderId: string;

  @Column()
  customerId: string;

  @Column('jsonb')
  items: { productId: string; quantity: number }[];

  @Column('decimal')
  totalAmount: number;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}