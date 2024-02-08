import { Answer } from "./quiz";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
export class QuestionDTO {
    @IsNotEmpty({ message: 'title is required' })
    @IsString({ message: 'title must be a string' })
    title: string

    
    answers: Answer[]

    constructor(title: string, answers: Answer[]) {
        this.title = title;
        this.answers = answers;
    }
    toJSON() {
        return {
            title: this.title,
            answers: this.answers
        };
    }
}