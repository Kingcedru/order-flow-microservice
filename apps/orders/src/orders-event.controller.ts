import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import type { OrderCreatedEvent } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';

@Controller()
export class OrderEventsController {
  private readonly logger = new Logger(OrderEventsController.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() data: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const order = this.orderRepo.create({
        orderId: data.orderId,
        customerId: data.customerId,
        items: data.items,
        totalAmount: data.totalAmount,
        status: 'PENDING',
      });
      await this.orderRepo.save(order);

      this.logger.log(`✅ Order ${data.orderId} persisted`);
      channel.ack(originalMsg); // tell RabbitMQ: safe to remove this message
    } catch (err) {
      this.logger.error(`❌ Failed to save order ${data.orderId}`, err);
      channel.nack(originalMsg, false, true); // requeue for retry
    }
  }
}