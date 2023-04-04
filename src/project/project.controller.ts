import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { removePaginatorFields } from '../core/utils/paginator.utils'
import { CreateProjectDto } from './dto/create-project.dto'
import { QueryProjectDto } from './dto/query-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Project } from './entities/project.entity'
import { ProjectService } from './project.service'

@ApiBearerAuth('Authorization')
@Controller('project')
@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({ type: Project })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(createProjectDto)
  }

  @ApiOperation({ summary: 'Filter project' })
  @ApiOkResponse({ type: Project })
  @Get('/filter')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async findByFilter(@Query() queryDto: QueryProjectDto): Promise<Pagination<Project>> {
    const { page, limit } = queryDto
    removePaginatorFields(queryDto)
    return await this.projectService.findByFilter(queryDto,
      {
        page,
        limit
      })
  }

  @ApiOperation({ summary: 'Find project by ID' })
  @ApiOkResponse({ type: Project })
  @Get(':id')
  @ApiNotFoundResponse()
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return await this.projectService.findById(id)
  }

  @ApiOperation({ summary: 'Update proyect' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto)
  }

  @ApiOperation({ summary: 'Delete project' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id)
  }
}
