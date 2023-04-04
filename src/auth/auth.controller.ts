import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dtos/create-user.dto'
import { LoginUserDto } from '../user/dtos/login-user.dto'
import { User } from '../user/entities/user.entity'
import { AuthService } from './auth.service'

@ApiBearerAuth('Authorization')
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.create(createUserDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.login(loginUserDto)
  }
}