import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;
      const hashedPassword: any = hash(password, 10);
      createUserDto = { ...createUserDto, password: hashedPassword };
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (e) {
      throw e;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    try {
      const { userName, password } = loginUserDto;
      const user = await this.userRepository.findOneOrFail({
        where: { userName },
      });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const validatePassword = await compare(password, user.password);
      if (!validatePassword)
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      const payload = {
        id: user.id,
        name: user.userName,
        email: user.email,
        active: user.isActive,
      };
      const token = this.jwtService.sign(payload);

      const data = { user, token };
      return data;
    } catch (e) {
      throw e;
    }
  }
}
