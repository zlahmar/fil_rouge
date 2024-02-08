// socket.module.ts

import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { QuizService } from '../quiz/quiz.service';

@Module({
    providers: [QuizService, SocketGateway],
})
export class SocketModule {}
