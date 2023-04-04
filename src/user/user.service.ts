import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { QueryUserDto } from './dtos/query-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existentUser = await this.userRepository.findOne({
        where: { userName: createUserDto.userName },
      });

      if (existentUser) {
        throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
      }

      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (e) {
      throw e;
    }
  }

  async findById(id: number): Promise<User> {
    let queryObj = this.userRepository.createQueryBuilder('t');
    queryObj.andWhere(`t.id = :id`, { id });
    try {
      queryObj.leftJoinAndSelect('t.team', 'tu');

      return await queryObj.getOneOrFail();
    } catch (e) {
      throw e;
    }
  }

  async findByFilter(
    queryDto: QueryUserDto,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    try {
      const queryObj = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.team', 'tu')
        .where(queryDto);

      return paginate<User>(queryObj, { ...options });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number) {
    try {
      let queryObj = this.userRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let deleteResponse = await this.userRepository.delete(id);
      if (deleteResponse.affected === 0) {
        throw new EntityNotFoundError(User, `id = ${id}`);
      }
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, updateDto: UpdateUserDto) {
    try {
      let queryObj = this.userRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let updateResponse = await this.userRepository.update(id, updateDto);
      if (updateResponse.affected === 0) {
        throw new EntityNotFoundError(User, `id = ${id}`);
      }
    } catch (e) {
      throw e;
    }
  }
}
