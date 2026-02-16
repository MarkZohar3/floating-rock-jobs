/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Controller, Logger } from '@nestjs/common';
import { JobsService } from '../../domain/jobs/jobs.service';

@Controller()
export class JobsMessageHandler {
  private readonly logger = new Logger(JobsMessageHandler.name);

  constructor(private readonly jobsService: JobsService) {}

  @MessagePattern('jobs')
  async handleJobsMessage(
    @Payload() payload: unknown,
    @Ctx() context: RmqContext,
  ): Promise<{ stored: boolean }> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.jobsService.createFromQueueMessage(payload);
      channel.ack(message);
      this.logger.log({
        event: 'jobs_message_processed',
        payload,
      });
      return { stored: true };
    } catch (error) {
      channel.nack(message, false, false);
      const details = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to process jobs message: ${details}`);
      throw error;
    }
  }
}
