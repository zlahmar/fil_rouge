import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { SocketModule } from '../socket/socket.module';


@Module({
  controllers: [QuizController],
  providers: [QuizService],
  imports: [SocketModule ],
})
export class QuizModule {}
