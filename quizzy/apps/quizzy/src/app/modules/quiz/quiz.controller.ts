
import { Body, Controller, Post, Get, Req, Headers, HttpException, HttpStatus, Response, Patch, Put } from '@nestjs/common';
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
    getAllQuizz(@Req() request : RequestWithUser, @Headers('authorization') authHeader: string) {
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        console.log("token: ",token)
        // console.log("allquizz: ",request)
        try {
            const uid = request.user.uid;
            const listeQuiz = this.quizzService.selectAll(uid);
            return listeQuiz;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get(':quizId')
    getQuizz(@Req() request : RequestWithUser) {
        try {
            const uid = request.user.uid;
            const theQuiz = this.quizzService.selectOne(request.params.quizId, uid);
            if (!theQuiz) {
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
            return theQuiz;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Patch(':quizId')
    async updateQuizz(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const uid = request.user.uid;
            const resUpdate = await this.quizzService.updateQuiz(request.params.quizId,request.body, uid);
            if (resUpdate) {
                // return HttpStatus.NO_CONTENT;
                return res.sendStatus(204).json();
            }else{
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PATCH: ", error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post(':quizId/questions')
    async createQuestion(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const uid = request.user.uid;
            const resCreate = await this.quizzService.createQuestion(request.params.quizId,request.body, uid);
            if (resCreate) {
                return res.setHeader('Location', 'http://localhost:3000/api/quiz/' + request.params.quizId).json().sendStatus(201);
            }else{
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PATCH: ", error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Put(':quizId/questions:questionId')
    async updateQuestion(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const uid = request.user.uid;
            const resUpdate = await this.quizzService.updateQuestion(request.params.quizId,request.params.questionId,request.body, uid);
            if (resUpdate) {
                return res.sendStatus(204).json();
            }else{
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PATCH: ", error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}

