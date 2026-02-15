import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobDto } from '../DTOs/job.dto';
import { Job, JobDocument } from './schemas/job.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}

  async findAll(): Promise<JobDto[]> {
    const jobs = await this.jobModel
      .find()
      .select({ title: 1, company: 1, location: 1, _id: 0 })
      .lean()
      .exec();

    return jobs.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
    }));
  }

  async createFromQueueMessage(payload: unknown): Promise<void> {
    const job = this.parseQueueMessage(payload);
    await this.jobModel.create(job);
  }

  private parseQueueMessage(payload: unknown): JobDto {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid jobs message: payload must be an object.');
    }

    const record = payload as Record<string, unknown>;
    const title = this.asNonEmptyString(record.title, 'title');
    const company = this.asNonEmptyString(record.company, 'company');
    const location = this.asOptionalString(record.location);

    return {
      title,
      company,
      location,
    };
  }

  private asNonEmptyString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Invalid jobs message: "${fieldName}" must be a string.`);
    }

    return value.trim();
  }

  private asOptionalString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new Error('Invalid jobs message: "location" must be a string.');
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }
}
