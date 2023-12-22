import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from './ping.service';

describe('PingService', () => {
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingService],
    }).compile();

    service = module.get<PingService>(PingService);
  });

  describe('ping', () => {
    it('should return "pong"', () => {
      expect(service.ping()).toBe('pong');
    });
  });
});

