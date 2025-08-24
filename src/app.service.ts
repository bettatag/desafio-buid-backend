import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.debug('getHello method called');

    const message = 'Hello World!';
    this.logger.log('Generated greeting message');

    return message;
  }
}
