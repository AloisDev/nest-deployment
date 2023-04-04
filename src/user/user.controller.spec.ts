import { Test, TestingModule } from '@nestjs/testing';
import { RoleEnum } from '../core/enums/role.enum';
import { PaginatorDto } from '../core/paginator.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UsersController;
  let service: UserService;

  const mockService = {
    findById: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    findByFilter: jest.fn((entity) => entity),
    update: jest.fn((id, entity) => ({ affected: 1 })),
    remove: jest.fn((id, entity) => ({ affected: 1 })),
  };

  const user: CreateUserDto = {
    userName: 'user1',
    password: 'password',
    email: 'email@email.com',
    isActive: false,
    role: RoleEnum.admin,
    teamId: null!,
    team: null!,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
      /**
       * Con el método overrideProvider se está sobrescribiendo el proveedor de servicios OrdersService
       * para que en su lugar se use un objeto mockService que se ha definido previamente.
       * Esto es útil para probar el controlador sin necesidad de utilizar un servicio real.
       */
    })
      .overrideProvider(UserService)
      .useValue(mockService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    expect(await controller.create(user)).toBe(user);
    expect(mockService.create).toHaveBeenCalledWith(user);
  });

  it('should be able to filter users by its properties', async () => {
    const paginatorDto: PaginatorDto = new PaginatorDto();
    const filter = {
      userName: 'user1',
      // email: 'email@email.com',
      // isActive: false,
      // role: RoleEnum.admin,
      //  teamId: null,
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
    await controller.update(id, user);
    expect(mockService.update).toHaveBeenCalledWith(id, user);
  });

  it('should delete a user', async () => {
    const id = 1;
    await controller.remove(id);
    expect(mockService.remove).toHaveBeenCalledWith(id);
  });
});
