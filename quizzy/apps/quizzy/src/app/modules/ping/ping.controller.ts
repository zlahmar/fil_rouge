import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/auth.decorator';

@Controller('ping')
export class PingController {
    @Get()
    @Auth()
    ping() {
        return {'Status': 'OK'};
    }
}
