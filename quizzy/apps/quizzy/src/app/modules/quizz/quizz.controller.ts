import { Body, Controller, Post } from '@nestjs/common';
import { QuizzService } from './quizz.service';

@Controller('quizz')
export class QuizzController {
    constructor(private readonly quizzService: QuizzService){}

    @Post()
    createQuizz(@Body() newQuizz){
        console.log('the Quizz', newQuizz);
        this.quizzService.create(newQuizz);
    }
}
