import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, Repository } from 'typeorm';
import { checkPaginatorLinks } from '../core/utils/paginator.utils';
import { CreateEpicDto } from './dto/create-epic.dto';
import { QueryEpicDto } from './dto/query-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { Epic } from './entities/epic.entity';

@Injectable()
export class EpicService {
  private readonly logger = new Logger(EpicService.name);
  constructor(
    @InjectRepository(Epic)
    private epicRepository: Repository<Epic>,
  ) {}

  async create(createEpicDto: CreateEpicDto): Promise<CreateEpicDto> {
    try {
      const existentUser = await this.epicRepository.findOne({
        where: { epicName: createEpicDto.epicName },
      });

      if (existentUser) {
        throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
      }

      const newUser: any = this.epicRepository.create(createEpicDto);
      return await this.epicRepository.save(newUser);
    } catch (e) {
      throw e;
    }
  }

  async findByFilter(
    queryDto: QueryEpicDto,
    options: IPaginationOptions,
  ): Promise<Pagination<Epic>> {
    try {
      const queryObj = this.epicRepository
        .createQueryBuilder('t')
        .select()
        .where(queryDto);

      const paginatedResult = await this.paginate(queryObj, options);
      return checkPaginatorLinks(paginatedResult);
    } catch (e) {
      throw e;
    }
  }

  async findById(id: number): Promise<Epic> {
    let queryObj = this.epicRepository.createQueryBuilder('t');
    queryObj.andWhere(`t.id = :id`, { id });
    try {
      queryObj.leftJoinAndSelect('t.epic', 'e');

      return await queryObj.getOneOrFail();
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, updateDto: UpdateEpicDto) {
    try {
      let queryObj = this.epicRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let updateResponse = await this.epicRepository.update(id, updateDto);
      if (updateResponse.affected === 0) {
        throw new EntityNotFoundError(Epic, `id = ${id}`);
      }
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number) {
    try {
      let queryObj = this.epicRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let deleteResponse = await this.epicRepository.delete(id);
      if (deleteResponse.affected === 0) {
        throw new EntityNotFoundError(Epic, `id = ${id}`);
      }
    } catch (e) {
      throw e;
    }
  }

  async paginate(queryObj: any, options: IPaginationOptions) {
    return paginate<Epic>(queryObj, {
      ...options,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    });
  }
}
