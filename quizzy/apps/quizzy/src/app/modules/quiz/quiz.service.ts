import { HttpException, HttpStatus, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Answer, Question, Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';

@Injectable()
export class QuizService {
    listQuiz = []
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async create(newQuiz: Quiz, uidUser: string): Promise<any> {
        try {
            console.log("quiz: ", newQuiz);
            const quizDocRef = await this.fa.firestore.collection('quiz').add({
                uid: uidUser,
                title: newQuiz.title,
                description: newQuiz.description,
            });
            
            return String(quizDocRef.id);

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Create new quiz: ', error);
        }
    }

    async selectAll(uidUser: string): Promise<any> {
        try {
            var quizzes = [];
            const documentData = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();
            if (documentData.empty) {
                return { "data": [] };
            }
            documentData.docs.forEach(element => {
                const quizObj = new Quiz();
                quizObj.id = element.id;
                quizObj.title = element.data()['title'];
                quizObj.description = element.data()['description'];
                quizzes.push(quizObj);
            });
            return { "data": quizzes, "_links": { "create": null } }; // links with issue 12
        } catch (error) {
            throw new UnauthorizedException('Unauthorized get all quiz: ', error);
        }
    }

    async updateQuiz(quizId: string, data, uidUser: string): Promise<any> {
        try {
            console.log("update_data: ", data);
            if (data) {
                data.forEach(async element => {
                    const cleanPath = element['path'].startsWith('/') ? element['path'].slice(1) : element['path'];
                    const documentData = await this.fa.firestore.collection('quiz').doc(quizId).get();

                    if (documentData.data()['uid'] != uidUser) {
                        throw new UnauthorizedException('Unauthorized update this quiz: ' + quizId);
                    }
                    switch (element['op']) {
                        case 'replace':
                            console.log("replace");
                            const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({ [cleanPath]: element['value'] });
                            console.log("resUpdate: ", resUpdate);
                    }
                });
                return true;
            }
        } catch (error) {
            throw new UnauthorizedException('Unauthorized update quiz: ', error);
        }
    }

    async createQuestion(quizId: string, newQuestion: Map<string, any>, uidUser: string): Promise<any> {
        try {
            const quizReference = this.fa.firestore.collection('quiz').doc(quizId);

            if ((await quizReference.get()).data()['uid'] != uidUser) {
                throw new UnauthorizedException('Unauthorized create question 1');
            }
            const resUpdate = await quizReference.collection('questions').add(newQuestion);
            return resUpdate;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized create question: ' , error);
        }
    }

    async getQuizById(quizId: string, uidUser: string): Promise<any> {
        try {
            const quizReference = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDocument = await quizReference.get();

            if (!quizDocument.exists || quizDocument.data()['uid'] !== uidUser) {
                throw new HttpException('Quiz not found or unauthorized', HttpStatus.NOT_FOUND);
            }
            const quizObj = new Quiz();
            quizObj.id = quizDocument.id;
            quizObj.title = quizDocument.data()['title'];
            quizObj.description = quizDocument.data()['description'];

            //Questions Part
            const questionsSnapshot = await quizReference.collection('questions').get();
            var questions = [];

            questionsSnapshot.forEach((doc) => {
                const currQuestion = new Question();
                currQuestion.id = doc.id;
                currQuestion.title = doc.data()['title'];
                currQuestion.answers = doc.data()['answers'];

                // console.log(doc.id, " => ", doc.data());
                questions.push(currQuestion);
            });
            quizObj.questions = questions;

            return quizObj;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized Get this quiz: ', error);
        }
    }
    async updateQuestion(quizId: string, questionId: string, questionUpdated: any, uidUser: string): Promise<any> {
        try {
            const quizRef = this.fa.firestore.collection('quiz').doc(quizId);
            const quizDoc = await quizRef.get();

            if (!quizDoc.exists || quizDoc.data()['uid'] !== uidUser) {
                throw new UnauthorizedException('Unauthorized Update this quiz, not authorized.');
            }

            const questionRef = quizRef.collection('questions').doc(questionId).update(questionUpdated);
            if (!questionRef) {
                throw new UnauthorizedException('Unauthorized Update this quiz.');
            }else{
                console.log("questionRef: ", questionRef);
                return true;
            }

        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Unauthorized Update this quiz: ', error);
        }
    }
}
