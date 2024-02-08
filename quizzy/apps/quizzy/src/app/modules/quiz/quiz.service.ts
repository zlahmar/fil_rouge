import { HttpException, HttpStatus, Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';

import { Answer, Question, Quiz } from './model/quiz';
import { CreateQuizDTO } from './model/QuizDTO';
import { PatchQuizDTO } from './model/PatchQuizDTO';
import { QuestionDTO } from './model/QuestionDTO';
import { Socket } from 'socket.io';

@Injectable()
export class QuizService {
    listQuiz = []
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) { }
    private hostClients: Map<string, Socket> = new Map();

    async createQuiz(createQuizDTO: CreateQuizDTO, uidUser: string): Promise<string> {
        try {
            createQuizDTO.uid = uidUser;
            const quizDocRef = await this.fa.firestore.collection('quiz').add(createQuizDTO);
            const urlCreate = `${process.env.API_BASE_URL}/quiz/${quizDocRef.id}`;
            return urlCreate;
        } catch (error) {
            console.log('Error creating quiz:', error);
            throw new UnauthorizedException('Unauthorized to create new quiz', error);
        }
    }

    async selectAll(uidUser: string): Promise<any> {
        try {
            const quizSnapshot = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();

            if (quizSnapshot.empty) {
                return { "data": [], "_links": { "create": `${process.env.API_BASE_URL}/quiz` } };
            }

            const quizzes = await Promise.all(quizSnapshot.docs.map(async (doc) => {
                const quiz = new Quiz(doc.id, doc.data()['title']);
                quiz.description = doc.data()['description'];

                const isReady = await this.isQuizReadyToStart(quiz);

                return {
                    ...quiz,
                    _links: {
                        start: isReady ? `${process.env.API_BASE_URL}/quiz/${quiz.id}/start` : null
                    }
                };
            }));

            return { "data": quizzes, "_links": { "create": `${process.env.API_BASE_URL}/quiz` } };
        } catch (error) {
            throw new UnauthorizedException('Unauthorized get all quiz: ', error);
        }
    }

    async patchQuiz(quizId: string, uidUser: string, thePatchQuiz: PatchQuizDTO[]): Promise<any> {
        try {
            const quizRef = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDoc = await quizRef.get();

            if (!quizDoc.exists || quizDoc.data()['uid'] !== uidUser) {
                throw new UnauthorizedException('Unauthorized to patch this quiz');
            }

            for (const element of thePatchQuiz) {
                const cleanPath = element.path.startsWith('/') ? element.path.slice(1) : element.path;

                if (element.op.toLowerCase() === 'replace') {
                    await quizRef.update({ [cleanPath]: element.value });
                }
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized to patch the quiz', error);
        }
    }

    async createQuestion(userId: string, quizId: string, newQuestion: QuestionDTO): Promise<any> {
        try {
            const quizDocRef = this.fa.firestore.collection('quiz').doc(quizId);

            if ((await quizDocRef.get()).data()['uid'] !== userId) {
                throw new UnauthorizedException('Unauthorized create question!');
            }

            const newQuestionRef = await quizDocRef.collection('questions').add(newQuestion);

            return newQuestionRef;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized to create the question: ', error);
        }
    }

    async getQuizById(quizId: string, uidUser: string): Promise<Quiz> {
        try {
            const quizRef = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDoc = await quizRef.get();

            if (!quizDoc.exists || quizDoc.data()['uid'] !== uidUser) {
                throw new HttpException('Quiz not found or unauthorized', HttpStatus.NOT_FOUND);
            }
            const quiz = new Quiz(quizDoc.id, quizDoc.data()['title']);
            const questionsSnap = await quizRef.collection('questions').get();
            const questions = [];

            questionsSnap.forEach((doc) => {
                const question = new Question(doc.id, doc.data()['title'], doc.data()['answers']);
                questions.push(question);
            });
            quiz.questions = questions;
            return quiz;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Get this quiz: ', error);
        }
    }
    async updateQuestion(quizId: string, questionId: string, uid: string, newQuestion: any): Promise<any> {
        try {
            const quizRef = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDoc = await quizRef.get();

            if (!quizDoc.exists || quizDoc.data()['uid'] !== uid) {
                throw new UnauthorizedException('Unauthorized to update this quiz.');
            }

            await quizRef.collection('questions').doc(questionId).update(newQuestion);
            return true;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized to update this question: ', error);
        }
    }

    private async isQuizReadyToStart(quiz: Quiz): Promise<boolean> {
        try {
            if (quiz.isStartable()) {
                const questionsSnapshot = await this.fa.firestore.collection('quiz').doc(quiz.id).collection('questions').get();
                const questionsAreStartable = questionsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const question = new Question(doc.id, data['title'], data['answers']);
                    return question.isStartable();
                });

                return questionsAreStartable.every(startable => startable === true);
            }
            return false;
        } catch (error) {
            console.error("Error in isQuizReadyToStart:", error);
            return false;
        }
    }

    async startQuizz(quizId: string, uid: string): Promise<string> {
        try {
            const quiz = await this.getQuizById(quizId, uid);

            if (!quiz) {
                throw new UnauthorizedException('Unauthorized to start this quiz: ' + quizId);
            }

            if (!this.isQuizReadyToStart(quiz)) {
                throw new BadRequestException('Quiz is not ready to be started');
            }
            const executionId = this.generateExecutionId();

            await this.fa.firestore.collection('quiz').doc(quizId).set({ execution_id: executionId }, { merge: true });
            const quizDocument = await this.fa.firestore.collection('quiz').doc(quizId).get();
            return executionId;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized to start quiz: ', error);
        }
    }

    private generateExecutionId(): string {
        const timestamp = new Date().getTime();
        const randomId = Math.random().toString(36).substr(2, 6);
        const executionId = `${timestamp}-${randomId}`;

        return executionId;
    }

    async getQuizDetailsByExecutionId(executionId: string): Promise<any> {
        try {
            const quizDocument = await this.fa.firestore.collection('quiz').where('execution_id', '==', executionId).get();
            const quiz = quizDocument.docs[0];
            return quiz.data();
        } catch (error) {
            throw new UnauthorizedException('Unauthorized Get this quiz: ', error);
        }
    }

    getConnectedParticipantsCount(executionId: string): number {
        const participantsArray = Array.from(this.hostClients.entries());
        const participantsInExecution = participantsArray.filter(([key, value]) => key === executionId);
        console.log("participantsInExecution: ", participantsInExecution);
        return participantsInExecution.length;
    }
}

