// quiz.gateway.ts
import { WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Body, Controller, UseGuards, Post, Get, Req, Headers, HttpException, HttpStatus, Response, Patch, Put } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Response as Res } from 'express';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Auth } from '../auth/auth.decorator';
import { Question } from './model/quiz';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Socket } from 'socket.io';
import { WsResponse } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
 

@WebSocketGateway()
export class QuizGateway {
  @WebSocketServer()
  server: Server;

  
  @SubscribeMessage('startQuiz')
async startQuizz(@Req() request: RequestWithUser, @Response() res: Res) {
   

     
        
    }
  // ... autres méthodes et gestionnaires WebSocket
}
