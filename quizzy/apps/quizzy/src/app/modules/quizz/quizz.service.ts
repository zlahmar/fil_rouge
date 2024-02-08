import { Injectable } from '@nestjs/common';
import { Quizz } from './model/quizz';

@Injectable()
export class QuizzService {
    listQuizz = []

    create(quizz : Quizz){
        this.listQuizz = [...this.listQuizz, quizz];
    }
}
