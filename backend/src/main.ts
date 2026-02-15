import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { JobsMessageDeserializer } from './jobs/jobs-message.deserializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const url = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  console.log('RMQ URL USED:', url);
  app.connectMicroservice<MicroserviceOptions>({
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
  });

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT ?? 3001}`)
    // .addBearerAuth() // enable if you use JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api/openapi.json',
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
