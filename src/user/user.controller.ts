import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { removePaginatorFields } from '../core/utils/paginator.utils';
import { CreateUserDto } from './dtos/create-user.dto';
import { QueryUserDto } from './dtos/query-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth('Authorization')
@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'creates new user' })
  @ApiCreatedResponse({ type: User })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Filter user' })
  @ApiOkResponse({ type: User })
  @Get('/filter')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async findByFilter(
    @Query() queryDto: QueryUserDto,
  ): Promise<Pagination<User>> {
    let { page, limit } = queryDto;
    removePaginatorFields(queryDto);
    return await this.userService.findByFilter(queryDto, {
      page: page,
      limit: limit,
    });
  }

  @ApiOperation({ summary: 'Finds user by ID' })
  @ApiOkResponse({ type: User })
  @Get(':id')
  @ApiNotFoundResponse()
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
