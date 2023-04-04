import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerModule } from 'nestjs-pino'
import { config } from '../ormconfig'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EpicModule } from './epic/epic.module'
import { ProjectModule } from './project/project.module'
import { TeamModule } from './team/team.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot({ ...config, autoLoadEntities: true }),
    AuthModule,
    UserModule,
    TeamModule,
    EpicModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
