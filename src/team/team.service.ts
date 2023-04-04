import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, Repository } from 'typeorm';
import { checkPaginatorLinks } from '../core/utils/paginator.utils';
import { CreateTeamDto } from './dto/create-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const existentUser = await this.teamRepository.findOne({
        where: { teamName: createTeamDto.teamName },
      });

      if (existentUser) {
        throw new HttpException('team_already_exist', HttpStatus.CONFLICT);
      }

      const newTeam = this.teamRepository.create(createTeamDto);
      return await this.teamRepository.save(newTeam);
    } catch (e) {
      throw e;
    }
  }

  async findByFilter(queryDto: QueryTeamDto, options: IPaginationOptions) {
    try {
      const queryObj = this.teamRepository
        .createQueryBuilder('t')
        .select()
        .leftJoinAndSelect('t.project', 'p')
        .where(queryDto);

      const paginatedResult = this.paginate(queryObj, options);
      return checkPaginatorLinks(paginatedResult);
    } catch (e) {
      throw e;
    }
  }

  async paginate(queryObj: any, options: IPaginationOptions) {
    return paginate<Team>(queryObj, {
      ...options,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    });
  }

  async findById(id: number) {
    let queryObj = this.teamRepository.createQueryBuilder('t');
    queryObj.andWhere(`t.id = :id`, { id });
    try {
      queryObj.leftJoinAndSelect('t.project', 'p');

      return await queryObj.getOneOrFail();
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    try {
      let queryObj = this.teamRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let updateResponse = await this.teamRepository.update(id, updateTeamDto);
      if (updateResponse.affected === 0) {
        throw new EntityNotFoundError(Team, `id = ${id}`);
      }
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      let queryObj = this.teamRepository.createQueryBuilder('t');
      queryObj.andWhere(`t.id = :id`, { id });
      try {
        await queryObj.getOneOrFail();
      } catch (e) {
        throw e;
      }

      let deleteResponse = await this.teamRepository.delete(id);
      if (deleteResponse.affected === 0) {
        throw new EntityNotFoundError(Team, `id = ${id}`);
      }
    } catch (err) {
      throw err;
    }
  }
}
