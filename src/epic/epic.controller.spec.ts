import { Test, TestingModule } from '@nestjs/testing';
import { PaginatorDto } from '../core/paginator.dto';
import { CreateEpicDto } from './dto/create-epic.dto';
import { EpicController } from './epic.controller';
import { EpicService } from './epic.service';

describe('EpicController', () => {
  let controller: EpicController;
  let service: EpicService;

  const mockService = {
    findById: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    findByFilter: jest.fn((entity) => entity),
    update: jest.fn((id, entity) => ({ affected: 1 })),
    remove: jest.fn((id, entity) => ({ affected: 1 })),
  };

  const epic: CreateEpicDto = {
    projectId: 1,
    epicName: 'epic1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpicController],
      providers: [EpicService],
    })
      .overrideProvider(EpicService)
      .useValue(mockService)
      .compile();

    controller = module.get<EpicController>(EpicController);
    service = module.get<EpicService>(EpicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    expect(await controller.create(epic)).toBe(epic);
    expect(mockService.create).toHaveBeenCalledWith(epic);
  });

  it('should be able to filter users by its properties', async () => {
    const paginatorDto: PaginatorDto = new PaginatorDto();
    const filter = {
      budget: 1000,
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
    await controller.update(id, epic);
    expect(mockService.update).toHaveBeenCalledWith(id, epic);
  });

  it('should delete a user', async () => {
    const id = 1;
    await controller.remove(id);
    expect(mockService.remove).toHaveBeenCalledWith(id);
  });
});
