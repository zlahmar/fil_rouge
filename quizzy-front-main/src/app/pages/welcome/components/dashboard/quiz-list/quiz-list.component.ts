import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { QuizListResponse } from '../../../../../services/quiz.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewQuizButtonComponent } from '../new-quiz-button/new-quiz-button.component';
import { QuizListTableComponent } from '../quiz-list-table/quiz-list-table.component';

@Component({
  selector: 'qzy-quiz-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, MatIconModule, MatTooltipModule, NewQuizButtonComponent, QuizListTableComponent],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss',
})
export class QuizListComponent {
  @Input() quizzes!: QuizListResponse;
  @Output() createQuiz = new EventEmitter<void>();
  @Output() startQuiz = new EventEmitter<string>();

  onCreateQuiz() {
    this.createQuiz.emit();
  }

  onStartQuiz(url: string) {
    this.startQuiz.emit(url);
  }
}
