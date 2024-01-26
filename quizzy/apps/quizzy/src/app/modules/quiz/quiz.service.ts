import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';

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

    async selectOne(id : string, uidUser:string): Promise<any>{
        try {
            const documentData = await this.fa.firestore.collection('quiz').doc(id).get();
            if (!documentData.exists || documentData.data()['uid'] != uidUser){
                return new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
            }
            console.log("documentData: ", documentData.data());

            const quizObj = new Quiz();
            quizObj.id = documentData.id;
            quizObj.title = documentData.data()['title'];
            quizObj.description = documentData.data()['description'];
            quizObj.questions = [];
            console.log("quizObj: ", quizObj);

            return quizObj;
            // return {"title": documentData.data()['title'],
            //         "description": documentData.data()['description'],
            //         "questions": []};
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

    }

    async update(id : string, data, uidUser:string): Promise<any>{
        try {
            if (data){
                data.forEach(async element => {
                    const operation = element['op'];
                    const path = element['path'];
                    const value = element['value'];
                    const documentData = await this.fa.firestore.collection('quiz').doc(id).get();

                    if (documentData.data()['uid'] != uidUser){
                        throw new HttpException('Unauthorized', HttpStatus.NOT_FOUND);
                    }
                    switch (operation) {
                        case 'replace':
                            const resUpdate = await this.fa.firestore.collection('quiz').doc(id).update({[path]: value});
                            console.log("resUpdate: ", resUpdate);
                    }
                });
                return true;
            }
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.NOT_FOUND);
        }
    }
    // async checkOwner(idQuiz : string, uidUser:string): Promise<boolean>{
    //     try {
    //         const documentData = await this.fa.firestore.collection('quiz').doc(idQuiz).get();
    //         if (!documentData.exists || !documentData.data() || documentData.data()['uid'] != uidUser){
    //             return false;
    //         }else{
    //             return true;
    //         }
    //     } catch (error) {
    //         throw new HttpException('Unauthorized', HttpStatus.NOT_FOUND);
    //     }
    // }
}
