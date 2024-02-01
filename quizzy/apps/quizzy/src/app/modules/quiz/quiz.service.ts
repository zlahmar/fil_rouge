import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { Answer, Question, Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
import { title } from 'process';

@Injectable()
export class QuizService {
    listQuiz = []


    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async create(newQuiz : Quiz, uidUser:string): Promise<any>{
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

    async selectAll(uidUser:string): Promise<any>{
        try {
            var quizzes = [];
            const documentData = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();
            if(documentData.empty){
                return {"data": []};
            }
            documentData.docs.forEach(element => {
                const quizObj = new Quiz();
                quizObj.id = element.id;
                quizObj.title = element.data()['title'];
                quizObj.description = element.data()['description'];
                quizzes.push(quizObj);
                // quizzes = [...quizzes, {"id": element.id, 
                //                         "title": element.data()['title'],
                //                         "description": element.data()['description']}];
            });
            return {"data": quizzes, "_links": {"create": null}}; // links with issue 12
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    // async selectOne(quizId : string, uidUser:string): Promise<any>{
    //     try {
    //         const documentData = await this.fa.firestore.collection('quiz').doc(quizId).get();
    //         if (!documentData.exists || documentData.data()['uid'] != uidUser){
    //             return new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    //         }

    //         const quizObj = new Quiz();
    //         quizObj.id = documentData.id;
    //         quizObj.title = documentData.data()['title'];
    //         quizObj.description = documentData.data()['description'];

    //         var questionList = [];
    //         documentData.data()['questions'].forEach(async questionId => {
    //             const questionDocumentInfo = await this.fa.firestore.collection('questions').doc(questionId).get();
    //             if (questionDocumentInfo.exists){
    //                 const currQuestionObj = new Question();
    //                 currQuestionObj.title = questionDocumentInfo.data()['title'];

    //                 var answersList = [];
    //                 questionDocumentInfo.data()['answers'].forEach(answer => {
    //                     const currAnswersObj = new Answer();
    //                     currAnswersObj.title = answer.title;
    //                     currAnswersObj.isCorrect = answer.isCorrect;
    //                     answersList.push(currAnswersObj);
    //                 });
    //                 console.log("answersList: ",answersList)
    //                 currQuestionObj.answers = answersList;
    //                 questionList.push(currQuestionObj);
    //             }
    //         });
    //         quizObj.questions = questionList;
    //         console.log("quizObj: ", quizObj);

    //         return quizObj;
    //     } catch (error) {
    //         throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    //     }

    // }

    async selectOne(quizId: string, uidUser: string): Promise<any> {
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
    
            const questionsPromises = questionIds.map(async questionId => {
                const questionDocumentInfo = await this.fa.firestore.collection('questions').doc(questionId).get();
                if (questionDocumentInfo.exists) {
                    const currQuestionObj = new Question();
                    currQuestionObj.title = questionDocumentInfo.data()['title'];
    
                    const answers = questionDocumentInfo.data()['answers'].map(answer => {
                        const currAnswerObj = new Answer();
                        currAnswerObj.title = answer.title;
                        currAnswerObj.isCorrect = answer.isCorrect;
                        return currAnswerObj;
                    });
    
                    currQuestionObj.answers = answers;
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
    

    async updateQuiz(quizId : string, data, uidUser:string): Promise<any>{
        try {
            console.log("update_data: ", data);
            if (data){
                data.forEach(async element => {
                    const cleanPath = element['path'].startsWith('/') ? element['path'].slice(1) : element['path'];
                    const documentData = await this.fa.firestore.collection('quiz').doc(quizId).get();

                    if (documentData.data()['uid'] != uidUser){
                        throw new HttpException('Unauthorized', HttpStatus.NOT_FOUND);
                    }
                    switch (element['op']) {
                        case 'replace':
                            console.log("replace");
                            const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({[cleanPath]: element['value']});
                            console.log("resUpdate: ", resUpdate);
                    }
                });
                return true;
            }
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.NOT_FOUND);
        }
    }
    
    async createQuestion(quizId : string, data, uidUser:string): Promise<any>{
        try {
            const quizInfo = await this.fa.firestore.collection('quiz').doc(quizId).get();
            if (quizInfo.data()['uid'] != uidUser){
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
            const resultCreate = await this.fa.firestore.collection('questions').add({
                title: data.title,
                answers: data.answers
            });
            const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({questions: admin.firestore.FieldValue.arrayUnion(resultCreate.id)});
            console.log("resUpdate: ", resUpdate);
            return true;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    async updateQuestion(quizId : string, questionId : string, data, uidUser:string): Promise<any>{
        try {
            const quizInfo = await this.fa.firestore.collection('quiz').doc(quizId).get();
            if (quizInfo.data()['uid'] != uidUser){
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }

            // const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({questions: admin.firestore.FieldValue.arrayRemove(data)});
            // console.log("resUpdate: ", resUpdate);
            return true;
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }
}
