import { HttpException, HttpStatus, Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Answer, Question, Quiz } from './model/quiz';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import { CreateQuizDTO } from './model/QuizDTO';
import { PatchQuizDTO } from './model/PatchQuizDTO';
import { QuestionDTO } from './model/QuestionDTO';
import { Socket } from 'socket.io';

@Injectable()
export class QuizService {
    listQuiz = []
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}
    private hostClients: Map<string, Socket> = new Map();

    async createQuiz(theNewQuiz: CreateQuizDTO, uidUser: string): Promise<any> {
        try {
            // console.log("quiz: ", theNewQuiz);
            theNewQuiz.uid = uidUser;
            const quizDocRef = await this.fa.firestore.collection('quiz').add(theNewQuiz);

            const urlCreate = process.env.API_BASE_URL+ "/quiz/" + quizDocRef.id;
            // console.log("urlCreate: ", urlCreate);

            return urlCreate;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized to create new quiz: ', error);
        }
    }

    async selectAll(uidUser: string): Promise<any> {
        try {
            var quizzes = [];
            const documentData = await this.fa.firestore.collection('quiz').where('uid', '==', uidUser).get();
            if (documentData.empty) {
                return { "data": [] };
            }
    
            const quizPromises = documentData.docs.map(async (element) => {
                const quizObj = new Quiz(element.id, element.data()['title']);
                quizObj.description = element.data()['description'];
                console.log("quizObj: ", quizObj);

                const isReady = await this.isQuizReadyToStart(quizObj);
    
                return {
                    ...quizObj,
                    _links: {
                        start: isReady ? `http://localhost:3000/api/quiz/${quizObj.id}/start` : null
                    }
                };
            });
    
            const quizzesWithLinks = await Promise.all(quizPromises);
    
            return { "data": quizzesWithLinks, "_links": { "create": process.env.API_BASE_URL + "/quiz" } };
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

            throw new UnauthorizedException('Unauthorized to update the quiz: ', error);
        }
    }
    
    // async updateQuiz(quizId: string, data, uidUser: string): Promise<any> {
    //     try {
    //         console.log("update_data: ", data);
    //         if (data) {
    //             data.forEach(async element => {
    //                 const cleanPath = element['path'].startsWith('/') ? element['path'].slice(1) : element['path'];
    //                 const documentData = await this.fa.firestore.collection('quiz').doc(quizId).get();

    //                 if (documentData.data()['uid'] != uidUser) {
    //                     throw new UnauthorizedException('Unauthorized update this quiz: ' + quizId);
    //                 }
    //                 switch (element['op']) {
    //                     case 'replace':
    //                         console.log("replace");
    //                         const resUpdate = await this.fa.firestore.collection('quiz').doc(quizId).update({ [cleanPath]: element['value'] });
    //                         console.log("resUpdate: ", resUpdate);
    //                 }
    //             });
    //             return true;
    //         }
    //     } catch (error) {
    //         throw new UnauthorizedException('Unauthorized to update the quiz: ', error);
    //     }
    // }

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

    private async isQuizReadyToStart(quiz: Quiz): Promise<boolean> {
        try {
            const questionsSnapshot = await this.fa.firestore.collection('quiz').doc(quiz.id).collection('questions').get();

            const questions = questionsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data['title'],
                    answers: data['answers'],
                    // Autres propriétés de la question
                };
            });
    
            if (!quiz.title || quiz.title.trim() === '') {
                console.log("Quiz title is empty");
                return false;
            }
    
            if (!questions || questions.length === 0) {
                console.log("No questions found");
                return false;
            }
    
            for (const question of questions) {
                if (!question || question.title.trim() === '') {
                    console.log("Question title is empty");
                    return false;
                }
    
                if (!question.answers || question.answers.length< 2) {
                    console.log("Not enough answers");
                    return false;
                }
    
               
            }
    
            return true;
        } catch (error) {
            console.error("Error in isQuizReadyToStart:", error);
            return false; // En cas d'erreur, considérez que le quiz n'est pas prêt
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
    
            // Générez l'ID d'exécution
            const executionId = this.generateExecutionId();

            // Stockez l'ID d'exécution dans Firestore

            await this.fa.firestore.collection('quiz').doc(quizId).set({ execution_id: executionId }, { merge: true });
           const quizDocument = await this.fa.firestore.collection('quiz').doc(quizId).get();
           console.log("quizDocument: ", quizDocument);
    
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
            
            console.log("quizDocument: ", quizDocument.docs[0]);
            return quiz.data();
        } catch (error) {
            throw new UnauthorizedException('Unauthorized Get this quiz: ', error);
        }
    }

    getConnectedParticipantsCount(executionId: string): number {
        // Utiliser la méthode Array.from pour obtenir un tableau des participants
        const participantsArray = Array.from(this.hostClients.entries());
        
        // Filtrer le tableau pour ne garder que les participants de l'exécution spécifiée
        const participantsInExecution = participantsArray.filter(([key, value]) => key === executionId);
      
        // Retourner le nombre de participants dans cette exécution
        console.log("participantsInExecution: ", participantsInExecution);
        return participantsInExecution.length;
      }
}

