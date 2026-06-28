import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { OrderCreatedEvent } from '@app/shared';

@Controller()
export class OrderEventsController {
  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    console.log('📦 Order received:', data);
    // Next phase: save this to Postgres instead of just logging
  }
}