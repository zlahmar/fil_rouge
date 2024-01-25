import { Injectable, Inject } from '@nestjs/common';
import { Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
@Injectable()
export class QuizService {
    listQuiz = []
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async create(quiz : Quiz, idToken:string): Promise<any>{
        console.log("quiz: ", quiz);
        console.log("idToken: ", idToken);
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        const documentData = await this.fa.firestore.collection('quiz').add({
            uid: uidUser,
            title: quiz.title,
            description: quiz.description
        });
        console.log("CREATE_QUIZ: documentData: ", documentData.id);
        return documentData.id;
    }

    async selectAll(idToken:string): Promise<any>{
        var quizzes = [];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        const documentData = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();
        if(documentData.empty){
            return {"data": []};
        }
        documentData.docs.forEach(element => {
            console.log("GET_QUIZ: element: ", element.data());
            quizzes = [...quizzes, {"id": element.id, 
                                    "title": element.data()['title'],
                                    "description": element.data()['description']}];
        });
        return {"data": quizzes, "_links": {"create": null}};
    }

    selectOne(id : string){
        this.listQuiz.forEach(quiz => {
            console.log("curr:", quiz.id);
            console.log("id:", Number(id));
            if (quiz.id == Number(id)){
                return quiz;
            }
        });
    }

}
