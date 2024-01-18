import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'path-to-your-database-service'; // Import your database service

@Injectable()
export class PingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async checkDatabaseConnection(): Promise<string> {
    try {
      
      const result = await this.databaseService.checkConnection();
      
      
      return result ? 'OK' : 'KO';
    } catch (error) {
      
      return 'KO';
    }
  }
}
