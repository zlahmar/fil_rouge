import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuizListResponse } from '../../../../../services/quiz.service';

@Component({
  selector: 'qzy-new-quiz-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatTooltipModule],
  templateUrl: './new-quiz-button.component.html',
  styleUrl: './new-quiz-button.component.scss',
})
export class NewQuizButtonComponent {
  @Output() createQuiz = new EventEmitter<void>();
  @Input() quizzes!: QuizListResponse;

  onCreateQuiz() {
    this.createQuiz.emit();
  }
}
