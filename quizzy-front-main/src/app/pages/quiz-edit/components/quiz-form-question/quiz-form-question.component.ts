import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../../../model/quiz-question';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'qzy-quiz-form-question',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatInputModule, TranslateModule, MatIconModule],
  templateUrl: './quiz-form-question.component.html',
  styleUrl: './quiz-form-question.component.scss',
})
export class QuizFormQuestionComponent {
  @Input() question!: QuizQuestion;
  @Output() updateQuestion = new EventEmitter<QuizQuestion>();

  updateTitle($event: Event) {
    const newTitle = ($event.target as HTMLInputElement).value;
    if (newTitle !== this.question.title) {
      this.question.title = newTitle;
      this.updateQuestion.emit(this.question);
    }
  }

  updateAnswer(answerContent: Event, index: number) {
    const newAnswer = (answerContent.target as HTMLInputElement).value;
    const currentAnswer = this.question.answers[index].title;
    if (newAnswer === currentAnswer) {
      return;
    }
    this.question.answers[index].title = newAnswer;
    this.updateQuestion.emit(this.question);
  }

  addAnswer($event: Event) {
    const newAnswer = ($event.target as HTMLInputElement).value;

    if(!newAnswer) {
      return;
    }

    this.question.answers.push({ title: newAnswer, isCorrect: false });
    this.updateQuestion.emit(this.question);
    ($event.target as HTMLInputElement).value = '';
  }

  toggleValid($index: number) {
    this.question.answers[$index].isCorrect = !this.question.answers[$index].isCorrect;
    this.updateQuestion.emit(this.question);
  }

  deleteAnswer($index: number) {
    this.question.answers.splice($index, 1);
    this.updateQuestion.emit(this.question);
  }
}
