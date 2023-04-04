import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MockType } from '../../test/utils/mock-type';
import { RoleEnum } from '../core/enums/role.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

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

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: MockType<Repository<User>>;

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
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user', async () => {
    const savedUser = new User();
    userRepository.findOne = jest.fn().mockResolvedValue(null);
    userRepository.create = jest.fn().mockReturnValue(savedUser);
    userRepository.save = jest.fn().mockResolvedValue(savedUser);

    const result = await userService.create(user);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { userName: user.userName },
    });
    expect(userRepository.create).toHaveBeenCalledWith(user);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  it('should find a user from the repository by ID', async () => {
    const getOneOrFail = jest.fn().mockReturnValue(user);
    const leftJoinAndSelect = jest.fn(() => ({ getOneOrFail }));
    const andWhere = jest.fn(() => ({ leftJoinAndSelect }));
    const where = jest.fn(() => ({ andWhere }));
    const select = jest.fn(() => ({ where }));
    userRepository.createQueryBuilder = jest.fn(() => ({
      select,
      andWhere,
      where,
      getOneOrFail,
      leftJoinAndSelect,
    }));

    const result = await userService.findById(user.id!);
    expect(result).toEqual(user);
    expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('t');
  });

  it('should return a paginated list of users that match the query', async () => {
    // const queryDto: QueryUserDto = new QueryUserDto();
    // const options = {
    //   page: 1,
    //   limit: 10,
    // };
    // const users = [new User()];
    // jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
    //   leftJoinAndSelect: jest.fn().mockReturnThis(),
    //   where: jest.fn().mockReturnThis(),
    // } as unknown as SelectQueryBuilder<User>);
    // jest.spyOn(paginate, 'paginate').mockResolvedValue(new Pagination(users, 1, 1, 10));
    // const result = await userService.findByFilter(queryDto, { page: 1, limit: 10 });
    // expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    // expect(result).toEqual(new Pagination(users, 1, 1, 10));
  });

  it('should throw an exception if the user with id does not exist', async () => {
    const userId: number = 1;
    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
    } as unknown as SelectQueryBuilder<User>;
    jest
      .spyOn(userRepository, 'createQueryBuilder')
      .mockReturnValueOnce(queryBuilder);
    await expect(userService.findById(userId)).rejects.toThrow(Error);
    expect(userRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
  });

  it('should remove a user', async () => {
    const id: number = 1;
    jest
      .spyOn(userRepository, 'delete')
      .mockImplementation(() => ({ affected: 1 }));
    await userService.remove(id);
    expect(userRepository.delete).toHaveBeenCalledWith(id);
  });

  it('should be possible to update a user', async () => {
    const updateUser: UpdateUserDto = {
      email: 'ella@email.com',
      ...user,
    };
    const id: number = 1;

    await userService.update(id, updateUser);
    expect(userRepository.update).toHaveBeenCalledWith(id, updateUser);
  });
});
