import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Order } from './orders.entity';
import { OrdersController } from './orders.controller';
import { OrderEventsController } from './orders-event.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [Order],
        synchronize: true, // ⚠️ dev only — generates schema automatically. Never use in production.
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Order]),
    ClientsModule.registerAsync([
      {
        name: 'ORDERS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get('RABBITMQ_URL')],
            queue: 'orders_queue',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController, OrderEventsController],
  providers: [OrdersService],
})
export class OrdersModule {}