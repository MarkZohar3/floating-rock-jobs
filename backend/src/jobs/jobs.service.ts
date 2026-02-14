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
      .select({ title: 1, company: 1, _id: 0 })
      .lean()
      .exec();

    return jobs.map((job) => ({
      title: job.title,
      company: job.company,
    }));
  }
}
