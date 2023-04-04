import { Test, TestingModule } from '@nestjs/testing';
import { PaginatorDto } from '../core/paginator.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  const project: CreateProjectDto = {
    teamId: 1,
    projectName: 'project1',
    startedAt: new Date(),
    finishedAt: new Date(),
    completed: false,
  };

  const mockService = {
    findById: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    findByFilter: jest.fn((entity) => entity),
    update: jest.fn((id, entity) => ({ affected: 1 })),
    remove: jest.fn((id, entity) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    })
      .overrideProvider(ProjectService)
      .useValue(mockService)
      .compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    expect(await controller.create(project)).toBe(project);
    expect(mockService.create).toHaveBeenCalledWith(project);
  });

  it('should be able to filter users by its properties', async () => {
    const paginatorDto: PaginatorDto = new PaginatorDto();
    const filter = {
      projectName: 'project1',
    };
    expect(
      await controller.findByFilter({ ...filter, ...paginatorDto }),
    ).toStrictEqual(filter);
    expect(mockService.findByFilter).toHaveBeenCalledWith(filter, {
      limit: 10,
      page: 1,
    });
  });

  it('should find a user by ID', async () => {
    const userId = 1;
    await controller.findById(userId);
    expect(mockService.findById).toHaveBeenCalledWith(userId);
  });

  it('should update user', async () => {
    const id = 1;
    await controller.update(id, project);
    expect(mockService.update).toHaveBeenCalledWith(id, project);
  });

  it('should delete a user', async () => {
    const id = 1;
    await controller.remove(id);
    expect(mockService.remove).toHaveBeenCalledWith(id);
  });
});
