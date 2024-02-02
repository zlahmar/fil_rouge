import { IsBoolean, IsNotEmpty, IsString, ValidateNested, IsArray, MinLength, ArrayMinSize, ArrayUnique, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
export class Quiz {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsArray()
  @Type(() => Question)
  questions: Question[];
  @IsObject()
  _links: object;
}
export class Question {

  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}
export class Answer {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}