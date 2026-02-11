import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('jobs')
  getJobs() {
    return {
      jobs: [
        { title: 'Fullstack Developer', company: 'Spotify' },
        { title: 'Frontend Engineer', company: 'Airbnb' },
        { title: 'Backend Engineer', company: 'Stripe' },
        { title: 'DevOps Engineer', company: 'Netflix' },
      ],
    };
  }
}
