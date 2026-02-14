import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JobDto } from './DTOs/job.dto';
import { JobsService } from './jobs/jobs.service';

@ApiTags('jobs')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jobsService: JobsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('jobs')
  @ApiOkResponse({ description: 'List jobs', type: JobDto, isArray: true })
  async getJobs(): Promise<JobDto[]> {
    return this.jobsService.findAll();
  }
}
