import { Injectable } from '@nestjs/common';
import { Quiz } from './model/quiz';

@Injectable()
export class QuizService {
    listQuiz = []

    create(quiz : Quiz){
        this.listQuiz = [...this.listQuiz, quiz];
    }

    selectAll(){
        return this.listQuiz;
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
