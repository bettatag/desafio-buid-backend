import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { IsPublic } from './shared/decorators/is-public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a hello world message',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
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
