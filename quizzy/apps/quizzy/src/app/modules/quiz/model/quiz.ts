import { IsBoolean, IsNotEmpty, IsString, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
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
}
export class Question {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(2)
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
