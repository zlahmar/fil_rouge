import { Body, Controller, Post, Get, Req, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { RequestWithUser } from '../auth/model/request-with-user';
// import { Location } from 'nestjs-rsvp';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizzService: QuizService) { }

    @Post()
    // @Location('/quizz/{id}')
    createQuizz(@Body() newQuizz, @Headers('authorization') authHeader: string) {
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!bearerToken) {
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
        }
        console.log('the Quizzcrezte', newQuizz);
        const resQuiz = this.quizzService.create(newQuizz, bearerToken);
        if (!resQuiz) {
            throw new HttpException('No token provided', HttpStatus.SERVICE_UNAVAILABLE);
        }
        return resQuiz;
    }

    @Get()
    getAllQuizz(@Headers('authorization') authHeader: string) {
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!bearerToken) {
            throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
        }
        const listeQuiz = this.quizzService.selectAll(bearerToken);
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

