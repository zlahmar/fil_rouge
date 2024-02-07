import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../../../../model/quiz';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'qzy-quiz-list-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, RouterLink],
  templateUrl: './quiz-list-table.component.html',
  styleUrl: './quiz-list-table.component.scss',
})
export class QuizListTableComponent {
  displayedColumns: string[] = ['title', 'actions'];
  @Input() quizzes!: Quiz[]  ;
  @Output() startQuiz = new EventEmitter<string>();

  onStartQuiz(url: string) {
    this.startQuiz.emit(url);
  }
}
