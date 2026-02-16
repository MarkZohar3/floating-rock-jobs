import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Job, JobSchema } from './domain/jobs/schemas/job.schema';
import { JobsService } from './domain/jobs/jobs.service';
import { JobsMessageHandler } from './infra/rabbitmq/jobs-message.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/job_aggregator',
    ),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  ],
  controllers: [AppController, JobsMessageHandler],
  providers: [AppService, JobsService],
})
export class AppModule {}
