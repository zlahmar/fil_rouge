// socket.gateway.ts

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

        //throw new Error('Method not implemented.');
    }

  @WebSocketServer()
  server: Server;

  async handleInit() {
    console.log('Socket gateway initialized');
    // Initialisation

    // Initialisation des événements WebSocket
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('welcome', 'Bienvenue sur le serveur WebSocket');

    // Gérer la connexion du client
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Gérer la déconnexion du client
  }

  @SubscribeMessage('host')
  async handleHostEvent(client: Socket, payload: { executionId: string }) {
    console.log('Host event received:', payload);
    try {
      const quiz = await this.quizService.getQuizDetailsByExecutionId(payload.executionId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      // Envoyer les détails du quiz à l'hôte
      client.emit('hostDetails', { quiz: quiz.title });

      // Envoyer le statut aux participants
      const participants = this.server.sockets.sockets.size - 1; // -1 pour exclure l'hôte
      this.server.emit('status', { status: 'waiting', participants });
    } catch (error) {
      console.error('Error handling host event:', error);
      // Gérer les erreurs
    }
  }

  
  @SubscribeMessage('join')
  async handleJoinEvent(@MessageBody() payload: { executionId: string }, @ConnectedSocket() client: Socket): Promise<any> {
    const executionId = payload.executionId;
    console.log('Join event :', executionId);

    try {
      // Vérifier si l'exécution existe et obtenir des détails sur le quiz
      const quizDetails = await this.quizService.getQuizDetailsByExecutionId(executionId);
      console.log('Quiz details:', quizDetails);

      // Événement joinDetails
      client.emit('joinDetails', { quizTitle: quizDetails.title });

      // Événement status
      const participantsCount =  this.quizService.getConnectedParticipantsCount(executionId);
      console.log('Participants count:', participantsCount);
      client.emit('status', { status: 'waiting', participants: participantsCount });

    } catch (error) {
      // Gérer les erreurs, par exemple si l'exécution n'existe pas
      client.emit('error', { message: 'Invalid execution ID' });
    }
  }
}
