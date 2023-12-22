import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { Auth } from '../auth/auth.decorator';

@Controller('quizz')
export class QuizzController {
    constructor(private readonly quizzService: QuizzService) { }

    @Post('create')
    createQuizz(@Body() newQuizz) {
        console.log('the Quizz', newQuizz);
        this.quizzService.create(newQuizz);
    }
}

