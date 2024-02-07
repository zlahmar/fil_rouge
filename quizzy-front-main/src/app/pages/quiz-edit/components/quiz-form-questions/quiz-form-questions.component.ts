import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../../../model/quiz-question';
import { QuizService } from '../../../../services/quiz.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { QuizFormQuestionComponent } from '../quiz-form-question/quiz-form-question.component';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'qzy-quiz-form-questions',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, MatButtonModule, QuizFormQuestionComponent],
  templateUrl: './quiz-form-questions.component.html',
  styleUrl: './quiz-form-questions.component.scss',
})
export class QuizFormQuestionsComponent {
  private readonly quizService = inject(QuizService);
  private readonly snackBarService = inject(MatSnackBar);
  @Input() quizId!: string;
  @Input() questions!: QuizQuestion[];

  addQuestion() {
    this.quizService.addQuestion(this.quizId).subscribe((question) => {
      this.questions.push(question);
    });
  }

  updateQuestion(question: QuizQuestion) {
    this.quizService.updateQuestion(this.quizId, question)
      .pipe(catchError((err) => {
        this.snackBarService.open(`Error while updating question title: ${err.message}`, 'OK', { duration: 5000, panelClass: 'error'} );
        return of(null);
      }))
      .subscribe();
  }
}
