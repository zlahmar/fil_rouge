import { Injectable } from '@nestjs/common';
import { Quizz } from './model/quizz';

@Injectable()
export class QuizzService {
    listQuizz = []

    create(quizz : Quizz){
        this.listQuizz = [...this.listQuizz, quizz];
    }

    selectAll(){
        return this.listQuizz;
    }

    selectOne(id : string){
        this.listQuizz.forEach(quiz => {
            console.log("curr:", quiz.id);
            console.log("id:", Number(id));
            if (quiz.id == Number(id)){
                return quiz;
            }
        });
    }

}
