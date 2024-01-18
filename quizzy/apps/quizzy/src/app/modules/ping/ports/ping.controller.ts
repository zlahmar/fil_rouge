import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller('api')
export class PingController {
  @Get('ping')
  ping(): { status: string } {
    
    const isAppHealthy = true;

    if (isAppHealthy) {
      return { status: 'OK' };
    } else {
      throw new Error('Internal Server Error');
    }
  }
}