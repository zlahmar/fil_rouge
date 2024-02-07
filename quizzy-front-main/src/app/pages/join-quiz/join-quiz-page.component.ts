import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientJoinDetails, QuizJoinService } from './quiz-join.service';
import { tap } from 'rxjs';

@Component({
  selector: 'qzy-join-quiz-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-quiz-page.component.html',
  styleUrl: './join-quiz-page.component.scss',
})
export class JoinQuizPageComponent implements OnInit {
  private readonly quizJoinService = inject(QuizJoinService);
  status$ = this.quizJoinService.status$.pipe(tap(console.log));
  quizDetails?: ClientJoinDetails;
  question$ = this.quizJoinService.question$;
  @Input() id!: string;

  async ngOnInit() {
    console.log('id is', this.id);
    if (this.id) {
      this.quizDetails = await this.quizJoinService.joinQuiz(this.id);
    }
  }
}
