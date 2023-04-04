import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '../../test/utils/mock-type';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { TeamService } from './team.service';

const repositoryMockFactory: () => MockType<Repository<Team>> = jest.fn(() => ({
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

describe('TeamService', () => {
  let service: TeamService;
  let repositoryMock: MockType<Repository<Team>>;

  const team: CreateTeamDto = {
    teamName: 'team1',
    budget: 100,
    projectId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    repositoryMock = module.get(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a team', async () => {
    const savedTeam = new Team();
    repositoryMock.findOne = jest.fn().mockResolvedValue(null);
    repositoryMock.create = jest.fn().mockReturnValue(savedTeam);
    repositoryMock.save = jest.fn().mockResolvedValue(savedTeam);

    const result = await service.create(team);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { teamName: team.teamName },
    });
    expect(repositoryMock.create).toHaveBeenCalledWith(team);
    expect(repositoryMock.save).toHaveBeenCalledWith(savedTeam);
    expect(result).toEqual(savedTeam);
  });

  it('should find a team from the repository by ID', async () => {
    const getOneOrFail = jest.fn().mockReturnValue(team);
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

    const result = await service.findById(team.id!);
    expect(result).toEqual(team);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should throw an exception if the team with id does not exist', async () => {
    const teamId: number = 1;
    repositoryMock.createQueryBuilder?.mockImplementation(() => {
      throw new Error();
    });
    await expect(service.findById(teamId)).rejects.toThrow(Error);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should remove a team', async () => {
    const id: number = 1;
    jest
      .spyOn(repositoryMock, 'delete')
      .mockImplementation(() => ({ affected: 1 }));
    await service.remove(id);
    expect(repositoryMock.delete).toHaveBeenCalledWith(id);
  });

  it('should be possible to update a team', async () => {
    const updateTeam: UpdateTeamDto = {
      budget: 155,
      ...team,
    };
    const id: number = 1;

    await service.update(id, updateTeam);
    expect(repositoryMock.update).toHaveBeenCalledWith(id, updateTeam);
  });
});
