import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env.MS_EMAIL_SENDER_URL || 'amqp://guest:guest@localhost:5672',
      ],
      queue: process.env.MS_EMAIL_SENDER_QUEUE_NAME || 'email',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
