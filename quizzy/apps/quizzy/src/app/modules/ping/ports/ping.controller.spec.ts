import { Test, TestingModule } from '@nestjs/testing';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

describe('PingController', () => {
  let controller: PingController;
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [PingService],
    }).compile();

    controller = module.get<PingController>(PingController);
    service = module.get<PingService>(PingService);
  });

  describe('ping', () => {
    it('should return "pong"', () => {
      jest.spyOn(service, 'ping').mockReturnValue('pong');
      expect(controller.ping()).toBe('pong');
    });
  });
});
