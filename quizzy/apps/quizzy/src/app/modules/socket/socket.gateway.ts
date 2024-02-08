import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizService } from '../quiz/quiz.service';

@WebSocketGateway({
    cors: {
      origin: '*',
    }
  })export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly quizService: QuizService) {}
    afterInit(server: any) {

        console.log('Socket gateway initialized');
    }

  @WebSocketServer()
  server: Server;

  async handleInit() {
    console.log('Socket gateway initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('welcome', 'Bienvenue sur le serveur WebSocket');
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('host')
  async handleHostEvent(client: Socket, payload: { executionId: string }) {
    console.log('Host event received:', payload);
    try {
      const quiz = await this.quizService.getQuizDetailsByExecutionId(payload.executionId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      client.emit('hostDetails', { quiz: quiz.title });
      const participants = this.server.sockets.sockets.size - 1; // -1 pour exclure l'hôte
      this.server.emit('status', { status: 'waiting', participants });
    } catch (error) {
      console.error('Error handling host event:', error);
    }
  }

  
  @SubscribeMessage('join')
  async handleJoinEvent(@MessageBody() payload: { executionId: string }, @ConnectedSocket() client: Socket): Promise<any> {
    const executionId = payload.executionId;
    console.log('Join event :', executionId);

    try {
      const quizDetails = await this.quizService.getQuizDetailsByExecutionId(executionId);
      console.log('Quiz details:', quizDetails);
      client.emit('joinDetails', { quizTitle: quizDetails.title });
      const participantsCount =  this.quizService.getConnectedParticipantsCount(executionId);
      console.log('Participants count:', participantsCount);
      client.emit('status', { status: 'waiting', participants: participantsCount });

    } catch (error) {
      client.emit('error', { message: 'Invalid execution ID' });
    }
  }
}
