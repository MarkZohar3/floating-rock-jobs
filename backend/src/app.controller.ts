import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JobDto } from './DTOs/job.dto';

@ApiTags('jobs')
@Controller('jobs')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('jobs')
  @ApiOkResponse({ description: 'List jobs', type: JobDto, isArray: true })
  getJobs(): JobDto[] {
    return [
      { title: 'Fullstack Developer', company: 'Spotify' },
      { title: 'Frontend Engineer', company: 'Airbnb' },
      { title: 'Backend Engineer', company: 'Stripe' },
      { title: 'DevOps Engineer', company: 'Netflix' },
    ];
  }
}
