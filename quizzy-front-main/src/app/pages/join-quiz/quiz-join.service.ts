import { inject, Injectable } from '@angular/core';
import { SocketService } from '../../services/socket.service';

export interface StatusEvent {
  status: 'waiting';
  participants: number;
}

export interface ClientJoinDetails {
  quizTitle: string;
}

export interface QuestionEvent {
  question: string;
  answers: string[];
}

@Injectable({ providedIn: 'root' })
export class QuizJoinService {
  private readonly socketService = inject(SocketService);
  status$ = this.socketService.listenToEvent<StatusEvent>('status');
  question$ = this.socketService.listenToEvent<QuestionEvent>('newQuestion');

  joinQuiz(id: string): Promise<ClientJoinDetails> {
    return new Promise(resolve => {
      this.socketService.sendEvent<ClientJoinDetails>('join', { executionId: id }, (response) => resolve(response));
    });
  }
}
