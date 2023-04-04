import { Test, TestingModule } from '@nestjs/testing';
import { PaginatorDto } from '../core/paginator.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;

  const mockService = {
    findById: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    findByFilter: jest.fn((entity) => entity),
    update: jest.fn((id, entity) => ({ affected: 1 })),
    remove: jest.fn((id, entity) => ({ affected: 1 })),
  };

  const team: CreateTeamDto = {
    teamName: 'team1',
    budget: 100,
    projectId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [TeamService],
    })
      .overrideProvider(TeamService)
      .useValue(mockService)
      .compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a team', async () => {
    await controller.create(team);
    expect(mockService.create).toHaveBeenCalledWith(team);
  });

  it('should filter teams by its properties', async () => {
    const paginatorDto: PaginatorDto = new PaginatorDto();
    const filter = {
      teamName: 'team1',
    };

    expect(
      await controller.findByFilter({ ...filter, ...paginatorDto }),
    ).toStrictEqual(filter);
    expect(mockService.findByFilter).toHaveBeenCalledWith(filter, {
      limit: 10,
      page: 1,
    });
  });

  it('should find a team by its ID', async () => {
    const id = 1;
    await controller.findById(id);
    expect(mockService.findById).toHaveBeenCalledWith(id);
  });

  it('should update a team', async () => {
    const id = 1;
    await controller.update(id, team);
    expect(mockService.update).toHaveBeenCalledWith(id, team);
  });

  it('should delete a team', async () => {
    const id = 1;
    await controller.remove(id);
    expect(mockService.remove).toHaveBeenCalledWith(id);
  });
});
