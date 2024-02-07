import { HttpException, HttpStatus, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Answer, Question, Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import { CreateQuizDTO } from './model/QuizDTO';
import { PatchQuizDTO } from './model/PatchQuizDTO';
import { QuestionDTO } from './model/QuestionDTO';

@Injectable()
export class QuizService {
    listQuiz = []
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createQuiz(theNewQuiz: CreateQuizDTO, uidUser: string): Promise<any> {
        try {
            // console.log("quiz: ", theNewQuiz);
            theNewQuiz.uid = uidUser;
            const quizDocRef = await this.fa.firestore.collection('quiz').add(theNewQuiz);

            const urlCreate = process.env.API_BASE_URL+ "/quiz/" + quizDocRef.id;
            // console.log("urlCreate: ", urlCreate);

            return urlCreate;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Create new quiz: ', error);
        }
    }

    async getAllQuiz(uidUser: string): Promise<any> {
        try {
            var quizzes = [];
            const documentData = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();
            if (documentData.empty) {
                return { "data": [] };
            }
            documentData.docs.forEach(element => {
                const quizObj = new Quiz(element.id, element.data()['title']);
                quizObj.description = element.data()['description'];
                quizzes.push(quizObj);
            });
            // console.log("quizzes: ", quizzes);
            return { "data": quizzes, "_links": { "create": process.env.API_BASE_URL + "/quiz" } };

        } catch (error) {
            throw new UnauthorizedException('Unauthorized get all quiz: ', error);
        }
    }

    async patchQuiz(quizId: string, uidUser: string, thePatchQuiz: PatchQuizDTO[]): Promise<any> {
        try {
            const quizReference = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDocument = await quizReference.get();

            if (!quizDocument.exists || quizDocument.data()['uid'] !== uidUser) {
                throw new UnauthorizedException('Unauthorized Patch this quiz !');
            }

            thePatchQuiz.forEach(async element => {
                const cleanPath = element['path'].startsWith('/') ? element['path'].slice(1) : element['path'];

                switch (element['op'].toLowerCase()) {
                    case 'replace':
                        console.log("replace");
                        const resUpdate = await quizReference.update({ [cleanPath]: element['value'] });
                        console.log("resUpdate: ", resUpdate);
                }
            });
            return true;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Patch this quiz: ', error);
        }
    }

    async createQuestion(uidUser: string, quizId: string, newQuestion: QuestionDTO): Promise<any> {
        try {
            const quizReference = this.fa.firestore.collection('quiz').doc(quizId);

            if ((await quizReference.get()).data()['uid'] != uidUser) {
                throw new UnauthorizedException('Unauthorized create question !');
            }
            console.log("newQuestion: ", newQuestion);
            const resUpdate = await quizReference.collection('questions').add(newQuestion);

            return resUpdate;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized create question: ', error);
        }
    }

    async getQuizById(quizId: string, uidUser: string): Promise<any> {
        try {
            const quizReference = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDocument = await quizReference.get();

            if (!quizDocument.exists || quizDocument.data()['uid'] !== uidUser) {
                throw new HttpException('Quiz not found or unauthorized', HttpStatus.NOT_FOUND);
            }
            const quizObj = new Quiz(quizDocument.id, quizDocument.data()['title']);

            //Questions Part
            const questionsSnapshot = await quizReference.collection('questions').get();
            var listQuestions = [];

            questionsSnapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                const currQuestion = new Question(doc.id,doc.data()['title'],doc.data()['answers']);
                listQuestions.push(currQuestion);
            });
            // console.log("questions: ", listQuestions);
            quizObj.questions = listQuestions;
            // console.log("quizObj: ", quizObj);
            return quizObj;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Get this quiz: ', error);
        }
    }
    async updateQuestion(quizId: string, questionId: string, uidUser: string, theNewQuestion: any): Promise<any> {
        try {
            const quizRef = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDoc = await quizRef.get();

            if (!quizDoc.exists || quizDoc.data()['uid'] !== uidUser) {
                throw new UnauthorizedException('Unauthorized Update this quiz, not authorized.');
            }
            // const jsonQuestion = JSON.stringify(theNewQuestion);
            // const jsonQuestion = theNewQuestion.toJSON();
            // console.log("jsonQuestion: ", jsonQuestion);
            const questionRef = await quizRef.collection('questions').doc(questionId).update(theNewQuestion);
            if (!questionRef) {
                throw new UnauthorizedException('Unauthorized Update this question.');
            } else {
                return true;
            }

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Update this question: ', error);
        }
    }
}
