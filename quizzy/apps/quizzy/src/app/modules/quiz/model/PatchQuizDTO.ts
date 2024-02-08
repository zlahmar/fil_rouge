import { IsNotEmpty, IsString } from "class-validator";

export class PatchQuizDTO {
    @IsNotEmpty({ message: 'op is required' })
    @IsString({ message: 'op must be a string' })
    op: string;
    @IsNotEmpty({ message: 'path is required' })
    @IsString({ message: 'path must be a string' })
    path: string;
    @IsNotEmpty({ message: 'value is required' })
    value: any;

    constructor(op: string, path: string, value: any) {
        op = op;
        path = path;
        value = value;
    }
}