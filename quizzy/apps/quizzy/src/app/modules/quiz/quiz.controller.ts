import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { request } from 'http';
import { RequestWithUser } from '../auth/model/request-with-user';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizzService: QuizService) { }

    @Post()
    createQuizz(@Body() newQuizz) {
        console.log('the Quizzcrezte', newQuizz);
        this.quizzService.create(newQuizz);
    }

    @Get()
    getAllQuizz() {
        const listeQuiz = this.quizzService.selectAll();
        console.log("Liste Quiz: ", listeQuiz);
        return listeQuiz;
    }

    @Get(':id')
    getQuizz(@Req() request : RequestWithUser) {
        console.log("parms id: ", request.params.id);
        const theQuiz = this.quizzService.selectOne(request.params.id);
        console.log("Quiz selected: ", theQuiz);
        return theQuiz;
    }
}

