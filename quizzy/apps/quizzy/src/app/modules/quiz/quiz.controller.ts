import { Body, Controller, Post, Get, Req, Headers, HttpException, HttpStatus, Response, Patch } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Response as Res } from 'express';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Auth } from '../auth/auth.decorator';
// import { Location } from 'nestjs-rsvp';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizzService: QuizService) { }

    @Auth()
    @Post()
    async createQuizz(@Body() newQuizz, @Response() res: Res, @Req() request : RequestWithUser){
        try {
            const uid = request.user.uid;
            const resQuiz = await this.quizzService.create(newQuizz, uid);
            console.log("resQuiz: ", resQuiz);
            if (!resQuiz) {
                throw new HttpException('No token provided', HttpStatus.SERVICE_UNAVAILABLE);
            }
            const urlCreate = "http://localhost:3000/api/quiz/" + resQuiz;
            console.log("urlCreate: ", urlCreate);
            return res.set({ 'Location': urlCreate }).json();

        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get()
    getAllQuizz(@Req() request : RequestWithUser) {
        try {
            const uid = request.user.uid;
            const listeQuiz = this.quizzService.selectAll(uid);
            return listeQuiz;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get(':id')
    getQuizz(@Req() request : RequestWithUser) {
        try {
            const uid = request.user.uid;
            console.log("parms id: ", request.params.id);
            const theQuiz = this.quizzService.selectOne(request.params.id, uid);
            console.log("Quiz selected: ", theQuiz);
            if (!theQuiz) {
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
            return theQuiz;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Patch(':id')
    async updateQuizz(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const uid = request.user.uid;
            const resUpdate = await this.quizzService.update(request.params.id,request.body, uid);
            if (resUpdate) {
                return HttpStatus.NO_CONTENT;
            }else{
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}

