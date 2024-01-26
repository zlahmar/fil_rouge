import { Body, Controller, Post, Get, Req, Headers, HttpException, HttpStatus, Res } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Response } from 'express';
//import { Location } from 'nestjs-rsvp';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizzService: QuizService) { }

    @Post()
    createQuiz(@Body() newQuizz, @Headers('authorization') authHeader: string, @Res() res: Response) {
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!bearerToken) {
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
        }
        console.log('The Quizcreate', newQuizz);
        const resQuiz = this.quizzService.create(newQuizz, bearerToken);
        if (!resQuiz) {
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
        }
        //return resQuiz;
        res.location('/quiz/${cereatedQuiz.id}').status(HttpStatus.CREATED).send();
    }

    @Get()
    getAllQuiz(@Headers('authorization') authHeader: string) {
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!bearerToken) {
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
        }
        const listeQuiz = this.quizzService.selectAll(bearerToken);
        return listeQuiz;
    }

    @Get(':id')
    getQuiz(@Req() request : RequestWithUser) {
        console.log("parms id: ", request.params.id);
        const theQuiz = this.quizzService.selectOne(request.params.id);
        console.log("Quiz selected: ", theQuiz);
        return theQuiz;
    }
}