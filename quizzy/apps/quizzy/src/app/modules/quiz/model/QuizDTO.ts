import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { QuestionDTO } from "./QuestionDTO";

export class CreateQuizDTO {
    uid: string;

    @IsNotEmpty({ message: 'title is required' })
    @IsString({ message: 'title must be a string' })
    title: string;

    @IsString({ message: 'description must be a string' })
    description: string;

    public toJson(): any{
        console.log("JSONdto: ", JSON.stringify(this))
        return {
            title: this.title,
            description: this.description
        };
    }
}