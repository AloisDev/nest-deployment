import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '../../test/utils/mock-type';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { Epic } from './entities/epic.entity';
import { EpicService } from './epic.service';

const repositoryMockFactory: () => MockType<Repository<Epic>> = jest.fn(() => ({
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

describe('EpicService', () => {
  let service: EpicService;
  let repositoryMock: MockType<Repository<Epic>>;

  const epic: CreateEpicDto = {
    projectId: 1,
    epicName: 'epic1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpicService,
        {
          provide: getRepositoryToken(Epic),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<EpicService>(EpicService);
    repositoryMock = module.get(getRepositoryToken(Epic));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an epic', async () => {
    const savedUser = new Epic();
    repositoryMock.findOne = jest.fn().mockResolvedValue(null);
    repositoryMock.create = jest.fn().mockReturnValue(savedUser);
    repositoryMock.save = jest.fn().mockResolvedValue(savedUser);

    const result = await service.create(epic);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { epicName: epic.epicName },
    });
    expect(repositoryMock.create).toHaveBeenCalledWith(epic);
    expect(repositoryMock.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  it('should find an epic from the repository by ID', async () => {
    const getOneOrFail = jest.fn().mockReturnValue(epic);
    const leftJoinAndSelect = jest.fn(() => ({ getOneOrFail }));
    const andWhere = jest.fn(() => ({ leftJoinAndSelect }));
    const where = jest.fn(() => ({ andWhere }));
    const select = jest.fn(() => ({ where }));
    repositoryMock.createQueryBuilder = jest.fn(() => ({
      select,
      andWhere,
      where,
      getOneOrFail,
      leftJoinAndSelect,
    }));

    const result = await service.findById(epic.id!);
    expect(result).toEqual(epic);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should throw an exception if the epic with id does not exist', async () => {
    const epicId: number = 1;
    repositoryMock.createQueryBuilder?.mockImplementation(() => {
      throw new Error();
    });
    await expect(service.findById(epicId)).rejects.toThrow(Error);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should remove an epic', async () => {
    const id: number = 1;
    jest
      .spyOn(repositoryMock, 'delete')
      .mockImplementation(() => ({ affected: 1 }));
    await service.remove(id);
    expect(repositoryMock.delete).toHaveBeenCalledWith(id);
  });

  it('should be possible to update a team', async () => {
    const updateEpic: UpdateEpicDto = {
      epicName: 'epicname',
    };
    const id: number = 1;

    await service.update(id, updateEpic);
    expect(repositoryMock.update).toHaveBeenCalledWith(id, updateEpic);
  });
});
