import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

import { FirebaseModule, FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';


describe('UsersService', () => {
  let service: UsersService;

  const mockFirebaseAdmin = {
    firestore: {
      doc: jest.fn(),
      collection: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
     
      providers: [
        UsersService,
        { provide: FirebaseConstants.FIREBASE_TOKEN, useValue: mockFirebaseAdmin },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
