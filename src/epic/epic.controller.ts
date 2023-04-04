import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { removePaginatorFields } from '../core/utils/paginator.utils'
import { CreateEpicDto } from './dto/create-epic.dto'
import { QueryEpicDto } from './dto/query-epic.dto'
import { UpdateEpicDto } from './dto/update-epic.dto'
import { Epic } from './entities/epic.entity'
import { EpicService } from './epic.service'

@ApiBearerAuth('Authorization')
@Controller('epic')
@ApiTags('Epics')
@UseGuards(JwtAuthGuard)
export class EpicController {
  constructor(private readonly epicService: EpicService) { }

  @ApiOperation({ summary: 'Create epic' })
  @ApiCreatedResponse({ type: Epic })
  @Post()
  async create(@Body() createEpicDto: CreateEpicDto): Promise<CreateEpicDto> {
    return this.epicService.create(createEpicDto)
  }

  @ApiOperation({ summary: 'Filter epic' })
  @ApiOkResponse({ type: Epic })
  @Get('/filter')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async findByFilter(@Query() queryDto: QueryEpicDto): Promise<Pagination<Epic>> {
    const { page, limit } = queryDto
    removePaginatorFields(queryDto)
    return await this.epicService.findByFilter(queryDto,
      {
        page,
        limit
      })
  }

  @ApiOperation({ summary: 'Find epic by ID' })
  @ApiOkResponse({ type: Epic })
  @Get(':id')
  @ApiNotFoundResponse()
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Epic> {
    return await this.epicService.findById(id)
  }

  @ApiOperation({ summary: 'Update epic' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateEpicDto: UpdateEpicDto) {
    return await this.epicService.update(id, updateEpicDto)
  }

  @ApiOperation({ summary: 'Delete epic' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.epicService.remove(id)
  }
}
