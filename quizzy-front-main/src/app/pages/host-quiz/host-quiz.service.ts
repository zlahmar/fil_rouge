import { inject, Injectable } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { map, tap } from 'rxjs';
import { Quiz } from '../../model/quiz';

export interface StatusEvent {
  status: 'waiting';
  participants: number;
}

export interface HostDetailsEvent {
  quiz: Quiz;
}

@Injectable({ providedIn: 'root' })
export class HostQuizService {
  private readonly socketService = inject(SocketService);

  status$ = this.socketService.listenToEvent<StatusEvent>('status').pipe(tap(
      status => console.log('status', status)
    )
  );
  connect(executionId: string): Promise<HostDetailsEvent> {
    return new Promise((resolve) => {
      this.socketService.sendEvent<HostDetailsEvent>('host', { executionId }, (response) => resolve(response));
    })
  }

  nextQuestion(executionId: string) {
    this.socketService.sendEvent('nextQuestion', { executionId });
  }
}
