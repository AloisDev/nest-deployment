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
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const existentProject = await this.projectRepository.findOne({
        where: { projectName: createProjectDto.projectName },
      });

      if (existentProject) {
        throw new HttpException('project_already_exist', HttpStatus.CONFLICT);
      }

      const newProject = this.projectRepository.create(createProjectDto);
      return await this.projectRepository.save(newProject);
    } catch (e) {
      throw e;
    }
  }

  async findByFilter(
    queryDto: QueryProjectDto,
    options: IPaginationOptions,
  ): Promise<Pagination<Project>> {
    try {
      const queryObj = this.projectRepository
        .createQueryBuilder('t')
        .select()
        .leftJoinAndSelect('t.epic', 'e')
        .where(queryDto);

      const paginatedResult = await this.paginate(queryObj, options);
      return checkPaginatorLinks(paginatedResult);
    } catch (e) {
      throw e;
    }
  }

  async findById(id: number): Promise<Project> {
    let queryObj = this.projectRepository.createQueryBuilder('t');
    queryObj.andWhere(`t.id = :id`, { id });
    try {
      queryObj.leftJoinAndSelect('t.epic', 'e');
      return await queryObj.getOneOrFail();
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      let queryObj = this.projectRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let updateResponse = await this.projectRepository.update(
        id,
        updateProjectDto,
      );
      if (updateResponse.affected === 0) {
        throw new EntityNotFoundError(Project, `id = ${id}`);
      }
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number) {
    try {
      let queryObj = this.projectRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let deleteResponse = await this.projectRepository.delete(id);
      if (deleteResponse.affected === 0) {
        throw new EntityNotFoundError(Project, `id = ${id}`);
      }
    } catch (e) {
      throw e;
    }
  }

  async paginate(queryObj: any, options: IPaginationOptions) {
    return paginate<Project>(queryObj, {
      ...options,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    });
  }
}
