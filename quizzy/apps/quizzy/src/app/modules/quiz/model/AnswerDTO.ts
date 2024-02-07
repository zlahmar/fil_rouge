import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class Answer {
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title must not be empty' })
    title: string;

    @IsBoolean({ message: 'isCorrect must be a boolean' })
    isCorrect = false;

    constructor(title: string, isCorrect: boolean) {
        this.title = title;
        this.isCorrect = isCorrect;
    }
}