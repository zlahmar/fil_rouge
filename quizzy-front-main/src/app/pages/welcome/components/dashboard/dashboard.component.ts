import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { QuizService } from '../../../../services/quiz.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';

@Component({
  selector: 'qzy-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, RouterLink, QuizListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  quizzes$ = this.quizService.getAll();

  createQuiz() {
    this.quizService.create().subscribe((quizId) => {
      this.router.navigateByUrl(`/quiz/${quizId}`);
    });
  }

  startQuiz(url: string) {
    this.quizService.start(url).subscribe((executionId) => {
      console.log(`executionId: ${executionId}`);
      this.router.navigateByUrl(`/host/${executionId}`);
    });
  }
}
