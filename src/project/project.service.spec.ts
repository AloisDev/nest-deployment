import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '../../test/utils/mock-type';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

const repositoryMockFactory: () => MockType<Repository<Project>> = jest.fn(
  () => ({
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
  }),
);

describe('ProjectService', () => {
  let service: ProjectService;
  let repositoryMock: MockType<Repository<Project>>;

  const project: CreateProjectDto = {
    teamId: 1,
    projectName: 'project1',
    startedAt: new Date(),
    finishedAt: new Date(),
    completed: false,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repositoryMock = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project', async () => {
    const savedUser = new Project();
    repositoryMock.findOne = jest.fn().mockResolvedValue(null);
    repositoryMock.create = jest.fn().mockReturnValue(savedUser);
    repositoryMock.save = jest.fn().mockResolvedValue(savedUser);

    const result = await service.create(project);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { projectName: project.projectName },
    });
    expect(repositoryMock.create).toHaveBeenCalledWith(project);
    expect(repositoryMock.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  it('should find a project from the repository by ID', async () => {
    const getOneOrFail = jest.fn().mockReturnValue(project);
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

    const result = await service.findById(project.id!);
    expect(result).toEqual(project);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should throw an exception if the project with id does not exist', async () => {
    const projectId: number = 1;
    repositoryMock.createQueryBuilder?.mockImplementation(() => {
      throw new Error();
    });
    await expect(service.findById(projectId)).rejects.toThrow(Error);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should remove a project', async () => {
    const id: number = 1;
    jest
      .spyOn(repositoryMock, 'delete')
      .mockImplementation(() => ({ affected: 1 }));
    await service.remove(id);
    expect(repositoryMock.delete).toHaveBeenCalledWith(id);
  });

  it('should be possible to update a project', async () => {
    const updateProject: UpdateProjectDto = {
      completed: true,
      ...project,
    };
    const id: number = 1;

    await service.update(id, updateProject);
    expect(repositoryMock.update).toHaveBeenCalledWith(id, updateProject);
  });
});
