import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Answer, Question, Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';

@Injectable()
export class QuizService {
    listQuiz = []
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) { }

    async create(newQuiz: Quiz, uidUser: string): Promise<string> {
        try {
            console.log("quiz: ", newQuiz);
            const documentData = await this.fa.firestore.collection('quiz').add({
                uid: uidUser,
                title: newQuiz.title,
                description: newQuiz.description
            });
            console.log("documentData: ", documentData.id);
            return String(documentData.id);

        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    async selectAll(uidUser: string): Promise<object> {
        try {
            const quizzes = [];
            const documentData = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();
            const apiUrl = process.env.API_MODE == "dev" ? process.env.API_DEV_BASEURL : process.env.API_PROD_BASEURL;
            if (documentData.empty) {
                return { "data": [], "_links": { "create": apiUrl + "/quiz" } };
            }
            documentData.docs.forEach(element => {
                const quizObj = new Quiz();
                quizObj.id = element.id;
                quizObj.title = element.data()['title'];
                quizObj.description = element.data()['description'];
                quizzes.push(quizObj);
            });
            return { "data": quizzes, "_links": { "create": apiUrl + "/quiz" } };
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }


    async selectOne(quizId: string, uidUser: string): Promise<object> {
        try {
            const documentData = await this.fa.firestore.collection('quiz').doc(quizId).get();
            if (!documentData.exists || documentData.data()['uid'] != uidUser) {
                return new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
            }

            const quizObj = new Quiz();
            quizObj.id = documentData.id;
            quizObj.title = documentData.data()['title'];
            quizObj.description = documentData.data()['description'];

            const questionIds = documentData.data()['questions'];

            const questionsPromises = questionIds.map(async (questionId: string) => {
                const questionDocumentInfo = await this.fa.firestore.collection('questions').doc(questionId).get();
                if (questionDocumentInfo.exists) {
                    const currQuestionObj = new Question();
                    currQuestionObj.title = questionDocumentInfo.data()['title'];

                  currQuestionObj.answers = questionDocumentInfo.data()['answers'].map((answer: { title: string; isCorrect: boolean; }) => {
                      const currAnswerObj = new Answer();
                      currAnswerObj.title = answer.title;
                      currAnswerObj.isCorrect = answer.isCorrect;
                      return currAnswerObj;
                    });
                    return currQuestionObj;
                }
                return null;
            });

            // Attendre que toutes les promesses soient résolues
            const questionList = await Promise.all(questionsPromises);
            quizObj.questions = questionList.filter(q => q !== null);

            console.log("quizObj: ", quizObj);

            return quizObj;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }


    async updateQuiz(quizId: string, data, uidUser: string): Promise<boolean> {
        try {
            console.log("update_data: ", data);
            if (data) {
              for (const element of data) {
                    const cleanPath = element['path'].startsWith('/') ? element['path'].slice(1) : element['path'];
                    const documentData = await this.fa.firestore.collection('quiz').doc(quizId).get();

                    if (documentData.data()['uid'] != uidUser) {
                        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
                    }
                    switch (element['op']) {
                        case 'replace':
                            console.log("replace");
                            // eslint-disable-next-line no-case-declarations
                            const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({ [cleanPath]: element['value'] });
                            console.log("resUpdate: ", resUpdate);
                    }
                }
              return true;
            }
        } catch (error) {
            console.log("SERVICE ERROR: ", error);
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }

    async createQuestion(quizId: string, data: Question, uidUser: string): Promise<boolean> {
        try {
            const quizInfo = await this.fa.firestore.collection('quiz').doc(quizId).get();
            if (quizInfo.data()['uid'] != uidUser) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
            const resultCreate = await this.fa.firestore.collection('questions').add({
                title: data.title,
                answers: data.answers
            });
            const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({ questions: admin.firestore.FieldValue.arrayUnion(resultCreate.id) });
            console.log("resUpdate: ", resUpdate);
            return true;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    async updateQuestion(quizId: string, questionId: string, data, uidUser: string): Promise<boolean> {
        try {
            const quizInfo = await this.fa.firestore.collection('quiz').doc(quizId).get();
            if (quizInfo.data()['uid'] != uidUser) {
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }

            return true;
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }
}
