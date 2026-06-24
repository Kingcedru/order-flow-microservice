import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderCreatedEvent } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() body: { customerId: string; items: any[]; totalAmount: number }) {
    const event: OrderCreatedEvent = {
      orderId: crypto.randomUUID(),
      customerId: body.customerId,
      items: body.items,
      totalAmount: body.totalAmount,
      createdAt: new Date().toISOString(),
    };

    // emit = fire-and-forget (pub/sub). We'll cover send() (RPC) in Phase 2.
    this.client.emit('order.created', event);

    return { message: 'Order submitted', orderId: event.orderId };
  }
}
