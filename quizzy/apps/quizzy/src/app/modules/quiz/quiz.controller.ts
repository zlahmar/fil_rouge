import { Body, Controller, UseGuards, Post, Get, Req, Headers, HttpException, HttpStatus, Response, Patch, Put } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Response as Res } from 'express';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Auth } from '../auth/auth.decorator';
import { Question } from './model/quiz';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizzService: QuizService) { }

    @Auth()
    @Post()
    async createQuiz(@Body() newQuizz, @Response() res: Res, @Req() request : RequestWithUser){
        try {
            const uid = request.user.uid;
            const resQuiz = await this.quizzService.create(newQuizz, uid);
            console.log("resQuiz: ", resQuiz);
            if (!resQuiz) {
                throw new HttpException('No token provided', HttpStatus.SERVICE_UNAVAILABLE);
            }
            // const urlCreate = "http://localhost:3000/api/quiz/" + resQuiz;
            // console.log("urlCreate: ", urlCreate);

            // //lien HATEOAS 'create' à la réponse
            // const response = {
            //     data: [{ id: resQuiz }],
            //     _links: { create: `http://localhost:3000/api/quiz` },
            // };

            const urlCreate = `http://localhost:3000/api/quiz/${resQuiz}`;

            const quizzes = await this.quizzService.selectAll(uid);

            // lien HATEOAS 'create' à la réponse
            const response = {
                data: quizzes.data,
                _links: { create: `http://localhost:3000/api/quiz` },
            };

            return res.set({ 'Location': urlCreate }).json();

        } catch (error) {
            throw new HttpException('Unauthorized to create the quiz', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get()
    getAllQuiz(@Req() request: RequestWithUser, @Headers('authorization') authHeader: string) {
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        console.log("token: ", token)
        console.log("allquizz: ", request)
        try {
            const uid = request.user.uid;
            const listeQuiz = this.quizzService.selectAll(uid);
            return listeQuiz;
        } catch (error) {
            throw new HttpException('Unauthorized to get all Quiz', HttpStatus.UNAUTHORIZED);
        }
    }

    @Patch(':quizId')
    async updateQuiz(@Req() request: RequestWithUser, @Response() res: Res, @Body() updateData: any,) {
        try {
            const uid = request.user.uid;
            const quizId = request.params.quizId;
            const quiz = await this.quizzService.getQuizById(quizId, uid);
            if (quiz) {
                await this.quizzService.updateQuiz(quizId, updateData, uid);
                return res.sendStatus(204).json();
            } else {
                throw new HttpException('Quiz not found or unauthorized', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Unauthorized to update the quiz', HttpStatus.UNAUTHORIZED);
            }
        }    
    }

    @Post(':quizId/questions')
    async createQuestion(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const uid = request.user.uid;
            const newQuestion = plainToClass(Question, request.body);
            await validateOrReject(newQuestion);

            const resCreate = await this.quizzService.createQuestion(request.params.quizId,request.body, uid);
            if (resCreate) {
                return res.setHeader('Location', 'http://localhost:3000/api/quiz/' + request.params.quizId +"/questions/"+ resCreate.id).json();
            }else{
                throw new HttpException('No token provided', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR Post: ", error);
            throw new HttpException('Unauthorized to create the question', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get(':quizId')
    async getQuizById(@Req() request: RequestWithUser) {
        try {
            const uid = request.user.uid;
            const quizId = request.params.quizId;

            const quiz = await this.quizzService.getQuizById(quizId, uid);

            return quiz;
        } catch (error) {
            throw new HttpException('Unauthorized to get the quiz', HttpStatus.UNAUTHORIZED);
        }
    }

    @Put(':quizId/questions/:questionId')
    async updateQuestion(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const uid = request.user.uid;
            const newQuestion = plainToClass(Question, request.body);
            await validateOrReject(newQuestion);

            const resUpdate = await this.quizzService.updateQuestion(request.params.quizId,request.params.questionId,request.body, uid);
            if (resUpdate) {
                return res.sendStatus(204);
            }else{
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PUT: ", error);
            throw new HttpException('Unauthorized to update question', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post(':quizId/start')
    // async startQuizz(@Req() request: RequestWithUser, @Response() res: Res) {
    //     const apiUrl = process.env.API_MODE == "dev" ? process.env.API_DEV_BASEURL : process.env.API_PROD_BASEURL;
    //     try {
    //         var response;
    //         response.Headers['location'] = apiUrl + '/execution/' + request.params.quizId;
    //         response.data = this.quizzService.startQuizz(request.params.quizId, request.user.uid);
    //         return response;
    //     } catch (error) {
    //         console.log("ERROR PATCH: ", error);
    //         throw new HttpException('Unauthorized to start', HttpStatus.UNAUTHORIZED);
    //     }
    // }

    async startQuizz(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const quizId = request.params.quizId;
            const uid = request.user.uid;

            //const quiz = await this.quizzService.getQuizById(quizId, uid);
            const executionId = await this.quizzService.startQuizz(quizId, uid);

            const apiUrl = process.env.API_MODE === 'dev' ? process.env.API_DEV_BASEURL : process.env.API_PROD_BASEURL;
            const executionUrl = `${apiUrl}/execution/${executionId}`;
            console.log("executionUrl: ", executionUrl);
            //console.log("res: ", res.location(executionUrl).status(HttpStatus.CREATED).send());

    
            return res.location(executionUrl).status(HttpStatus.CREATED).send();

        } catch (error) {
            console.error('Error in startQuiz:', error);

            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Unauthorized to start', HttpStatus.UNAUTHORIZED);
            }
        }
    }
}