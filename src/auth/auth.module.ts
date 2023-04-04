import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
require('dotenv').config()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRETKEY, //jwtConstants.secret,
      signOptions: { expiresIn: process.env.EXPIRESIN }
    })
  ],
  providers: [AuthService, UserService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
