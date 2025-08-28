import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { IsPublic } from './shared/decorators/is-public.decorator';
import { SkipThrottle } from './shared/decorators/throttle.decorator';

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

  @Get('health')
  @IsPublic()
  @SkipThrottle()
  @ApiOperation({ summary: 'Health check endpoint for Railway' })
  @ApiResponse({
    status: 200,
    description: 'Returns the health status of the API and its dependencies',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-20T10:30:00.000Z' },
        uptime: { type: 'number', example: 12345.67 },
        version: { type: 'string', example: '0.0.1' },
        environment: { type: 'string', example: 'production' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'connected' },
            memory: { type: 'object' },
            cpu: { type: 'object' }
          }
        }
      },
    },
  })
  async getHealth(): Promise<any> {
    this.logger.log('GET /health endpoint called');

    try {
      const result = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        message: 'Application is running successfully'
      };
      
      this.logger.log(`Health check successful - Uptime: ${result.uptime}s`);
      return result;
    } catch (error) {
      this.logger.error(
        'Error processing GET /health request',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
