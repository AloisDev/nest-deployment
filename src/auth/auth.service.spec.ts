import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '../../test/utils/mock-type';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

const repositoryMockFactory: () => MockType<Repository<User>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  delete: jest.fn((entity) => entity),
  update: jest.fn((entity) => entity),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOneOrFail: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
