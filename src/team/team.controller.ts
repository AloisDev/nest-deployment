import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { removePaginatorFields } from '../core/utils/paginator.utils'
import { CreateTeamDto } from './dto/create-team.dto'
import { QueryTeamDto } from './dto/query-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'
import { Team } from './entities/team.entity'
import { TeamService } from './team.service'

@ApiBearerAuth('Authorization')
@Controller('team')
@ApiTags('Team')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @ApiOperation({ summary: 'Creates team' })
  @ApiCreatedResponse({ type: Team })
  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto)
  }

  @ApiOperation({ summary: 'Filter team' })
  @ApiCreatedResponse({ type: Team })
  @Get('/filter')
  async findByFilter(@Query() queryDto: QueryTeamDto): Promise<Pagination<Team>> {
    const { page, limit } = queryDto
    removePaginatorFields(queryDto)
    return await this.teamService.findByFilter(queryDto,
      {
        page,
        limit
      })
  }

  @ApiOperation({ summary: 'Find team by ID' })
  @ApiCreatedResponse({ type: Team })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return this.teamService.findById(id)
  }

  @ApiOperation({ summary: 'Update team' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto)
  }

  @ApiOperation({ summary: 'Delete team' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.teamService.remove(id)
  }
}
