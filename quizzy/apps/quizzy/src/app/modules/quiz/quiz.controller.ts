
import { Body, Controller, Post, Get, Req, Headers, HttpException, HttpStatus, Response, Patch, Put } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Response as Res } from 'express';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Auth } from '../auth/auth.decorator';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Auth()

    @Post()
    async createQuiz(@Body() newQuiz, @Response() res: Res, @Req() request: RequestWithUser) {
        try {
            const { uid } = request.user;
            const resQuiz = await this.quizService.create(newQuiz, uid);
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
    getAllQuiz(@Req() request: RequestWithUser, @Headers('authorization') authHeader: string) {
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        console.log("token: ", token)

        try {
            return this.quizService.selectAll(request.user.uid);
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get(':quizId')
    getQuiz(@Req() request: RequestWithUser) {
        try {
            const { uid } = request.user;
            const theQuiz = this.quizService.selectOne(request.params.quizId, uid);
            if (!theQuiz) {
                throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
            }
            return theQuiz;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Patch(':quizId')
    async updateQuiz(@Req() request: RequestWithUser, @Response() res: Res) {
        try {
            const { uid } = request.user;
            const resUpdate = await this.quizService.updateQuiz(request.params.quizId, request.body, uid);
            if (resUpdate) {
                return res.sendStatus(204).json();
            } else {
                throw new HttpException('Could not update quiz', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post(':quizId/questions')
    async createQuestion(@Req() request: RequestWithUser, @Response() res: Res) {
        try {
            const { uid } = request.user;
            const resCreate = await this.quizService.createQuestion(request.params.quizId, request.body, uid);
            if (resCreate) {
                return res.setHeader('Location', 'http://localhost:3000/api/quiz/' + request.params.quizId).json().sendStatus(201);
            } else {
                throw new HttpException('Could not create question', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PATCH: ", error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Put(':quizId/questions:questionId')
    async updateQuestion(@Req() request: RequestWithUser, @Response() res: Res) {
        try {
            const { uid } = request.user;
            const resUpdate = await this.quizService.updateQuestion(request.params.quizId, request.params.questionId, request.body, uid);
            if (resUpdate) {
                return res.sendStatus(204).json();
            } else {
                throw new HttpException('Could not update question', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PATCH: ", error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post(':quizId/start')
    async startQuizz(@Req() request: RequestWithUser, @Response() res: Res) {
        const apiUrl = process.env.API_MODE == "dev" ? process.env.API_DEV_BASEURL : process.env.API_PROD_BASEURL;
        try {
            var response;
            response.Headers['location'] = apiUrl + '/execution/' + request.params.quizId;
            response.data = this.quizService.startQuizz(request.params.quizId, request.user.uid);
            return response;
        } catch (error) {
            console.log("ERROR PATCH: ", error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}

