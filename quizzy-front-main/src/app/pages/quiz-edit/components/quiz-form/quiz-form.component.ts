import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../../../model/quiz';
import { MatInputModule } from '@angular/material/input';
import { QuizService } from '../../../../services/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, NEVER } from 'rxjs';
import { QuizFormQuestionsComponent } from '../quiz-form-questions/quiz-form-questions.component';

@Component({
  selector: 'qzy-quiz-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, TranslateModule, QuizFormQuestionsComponent],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.scss'
})
export class QuizFormComponent {
  private readonly quizService = inject(QuizService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translateService = inject(TranslateService);
  @Input() quiz!: Quiz;
  @Input() quizId!: string;


  updateTitle($event: Event) {
    const newTitle = ($event.target as HTMLInputElement).value;
    if (newTitle !== this.quiz.title) {
      this.quizService.updateTitle(this.quizId, newTitle)
        .pipe(catchError(() => {
          this.snackBar.open(this.translateService.instant('quizEditPage.title.updateError'), this.translateService.instant('common.ok'), {
            duration: 2000
          });
          return NEVER;
        }))
        .subscribe(() => {
        this.snackBar.open(this.translateService.instant('quizEditPage.title.updated'), this.translateService.instant('common.ok'), {
          duration: 2000
        });
        this.quiz.title = newTitle;
      })
    }
  }
}
