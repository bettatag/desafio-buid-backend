import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('GET / endpoint called');

    try {
      const result = this.appService.getHello();
      this.logger.log(`Successfully processed request - Response: ${result}`);
      return result;
    } catch (error) {
      this.logger.error(
        'Error processing GET / request',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
