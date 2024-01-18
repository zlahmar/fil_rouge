import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { request } from 'http';
import { RequestWithUser } from '../auth/model/request-with-user';

@Controller('quizz')
export class QuizzController {
    constructor(private readonly quizzService: QuizzService) { }

    @Post('create')
    createQuizz(@Body() newQuizz) {
        console.log('the Quizzcrezte', newQuizz);
        this.quizzService.create(newQuizz);
    }

    @Get('select')
    getAllQuizz() {
        const listeQuiz = this.quizzService.selectAll();
        console.log("Liste Quiz: ", listeQuiz);
        return listeQuiz;
    }

    @Get('select/:id')
    getQuizz(@Req() request : RequestWithUser) {
        console.log("parms id: ", request.params.id);
        const theQuiz = this.quizzService.selectOne(request.params.id);
        console.log("Quiz selected: ", theQuiz);
        return theQuiz;
    }
}

