import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HostQuizService, StatusEvent } from './host-quiz.service';
import { Quiz } from '../../model/quiz';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'qzy-host-quiz-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './host-quiz-page.component.html',
  styleUrl: './host-quiz-page.component.scss',
})
export class HostQuizPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly hostQuizService = inject(HostQuizService);
  @Input() id!: string;

  currentStatus?: StatusEvent;
  quiz?: Quiz;

  async ngOnInit() {
    if (!this.id) {
      this.router.navigateByUrl('/');
    }
    this.hostQuizService.status$.subscribe((status) => {
      this.currentStatus = status;
    });
    const hostDetails = await this.hostQuizService.connect(this.id);
    this.quiz = hostDetails.quiz;
  }

  protected readonly environment = environment;

  nextQuestion() {
    this.hostQuizService.nextQuestion(this.id);
  }
}
