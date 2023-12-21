import { Controller, Post } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Post()
  ping() {
    return 'pong';
  }
}
