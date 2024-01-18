import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';

@Controller('ping')
export class PingController {
    @Get()
    ping() {
        return {'Status': 'OK'};
    }
}
