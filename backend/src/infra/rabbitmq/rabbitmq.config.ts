import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { JobsMessageDeserializer } from './jobs-message.deserializer';

export function createRabbitMqMicroserviceConfig(): MicroserviceOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE ?? 'jobs',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      deserializer: new JobsMessageDeserializer(),
    },
  };
}
