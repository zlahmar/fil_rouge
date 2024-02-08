import { Body, Controller, UseGuards, Post, Get, Req, Headers, HttpException, HttpStatus, Response, Patch, Put, ValidationPipe, ValidationError } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Response as Res } from 'express';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Auth } from '../auth/auth.decorator';

import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { Question } from './model/quiz';
import { CreateQuizDTO } from './model/QuizDTO';
import { PatchQuizDTO } from './model/PatchQuizDTO';
import { QuestionDTO } from './model/QuestionDTO';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizzService: QuizService) { }

    @Auth()
    @Post()
    async createQuizz(@Response() res: Res, @Req() request: RequestWithUser, @Body(new ValidationPipe({
        disableErrorMessages: true,
        exceptionFactory: (errors: ValidationError[]) => new HttpException('Validation error', HttpStatus.BAD_REQUEST),
    })) theNewQuiz: CreateQuizDTO){
        try {
            const uidUser = request.user.uid;
            const resultCreateQuiz = await this.quizzService.createQuiz(theNewQuiz, uidUser);

            if (!resultCreateQuiz) {
                console.log("Function: createQuiz => Firebase Error ! ");
                throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
            }

            return res.set({ 'Location': resultCreateQuiz }).json();

        } catch (error) {
            throw new HttpException('Unauthorized to create the quiz', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get()
    getAllQuiz(@Req() request: RequestWithUser) {
        try {
            const uidUser = request.user.uid;
            const listeQuiz = this.quizzService.selectAll(uidUser);

            return listeQuiz;
        } catch (error) {

            throw new HttpException('Unauthorized to get all Quiz', HttpStatus.UNAUTHORIZED);
        }
    }

    @Patch(':quizId')
    async patchQuiz(@Req() request: RequestWithUser, @Response() res: Res, @Body(new ValidationPipe({
        disableErrorMessages: true,
        exceptionFactory: (errors: ValidationError[]) => new HttpException('Validation error', HttpStatus.BAD_REQUEST),
    })) thePatchQuiz: [PatchQuizDTO]) {
        try {
            const uidUser = request.user.uid;
            const quizId = request.params.quizId;

            await this.quizzService.patchQuiz(quizId, uidUser, thePatchQuiz);
            return res.sendStatus(204);

        } catch (error) {
            console.log("ERROR Patch: ", error);
            throw new HttpException('Unauthorized to patch the quiz', HttpStatus.NOT_FOUND);
        }

    }

    @Post(':quizId/questions')
    async createQuestion(@Req() request: RequestWithUser, @Response() res: Res, @Body(new ValidationPipe({
        disableErrorMessages: true,
        exceptionFactory: (errors: ValidationError[]) => new HttpException('Validation error: '+errors, HttpStatus.BAD_REQUEST),
    })) theNewQuestion: QuestionDTO) {
        try {
            const uidUser = request.user.uid;
            const quizId = request.params.quizId;
            const resultCreateQuestion = await this.quizzService.createQuestion(uidUser, quizId, theNewQuestion);

            if (resultCreateQuestion.id) {
                return res.setHeader('Location', 'http://localhost:3000/api/quiz/' + request.params.quizId + "/questions/" + resultCreateQuestion.id).json();
            } else {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            console.log("ERROR Post: ", error);
            throw new HttpException('Unauthorized to create the question', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get(':quizId')
    async getOneQuiz(@Req() request: RequestWithUser) {
        try {
            const uid = request.user.uid;
            const quizId = request.params.quizId;
            const theQuiz = await this.quizzService.getQuizById(quizId, uid);

            return theQuiz;

        } catch (error) {
            throw new HttpException('Unauthorized to get the quiz', HttpStatus.UNAUTHORIZED);
        }
    }

    @Put(':quizId/questions/:questionId')
    async updateQuestion(@Req() request: RequestWithUser, @Response() res: Res, @Body(new ValidationPipe({
        disableErrorMessages: true,
        exceptionFactory: (errors: ValidationError[]) => new HttpException('Validation error: ' + errors, HttpStatus.BAD_REQUEST),
    })) theNewQuestion: QuestionDTO) {

        try {
            const uidUser = request.user.uid;
            const reqParams = request.params;
            const resUpdate = await this.quizzService.updateQuestion(reqParams.quizId, reqParams.questionId, uidUser, theNewQuestion);
            
            if (resUpdate) {
                return res.sendStatus(204);
            } else {
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log("ERROR PUT: ", error);
            throw new HttpException('Unauthorized to update question', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post(':quizId/start')
    async startQuizz(@Req() request : RequestWithUser, @Response() res: Res) {
        try {
            const quizId = request.params.quizId;
            const uid = request.user.uid;
            const executionId = await this.quizzService.startQuizz(quizId, uid);
            const executionUrl = `${process.env.API_BASE_URL}/execution/${executionId}`;
    
            return res.location(executionUrl).status(HttpStatus.CREATED).send();

        } catch (error) {
            throw new HttpException('Unauthorized to start the quiz', HttpStatus.UNAUTHORIZED);
        }
    }
}

