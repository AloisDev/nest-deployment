import { Logger as AppLogger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AuthModule } from './auth/auth.module'
import { EpicModule } from './epic/epic.module'
import { ProjectModule } from './project/project.module'
import { TeamModule } from './team/team.module'
import { UserModule } from './user/user.module'

const appLogger = new AppLogger('Application Bootstrap')
process.on('warning', (warning: Error) => {
  appLogger.error({ type: 'warning' })
  appLogger.error(warning)
})

process.on('unhandledRejection', (reason, promise) => {
  appLogger.error({ type: 'unhandledRejection', promise: promise })
  appLogger.error(reason)
})

process.on('uncaughtException', (error: Error) => {
  appLogger.error({ type: 'uncaughtException' })
  appLogger.error(error)
})

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule)
  app.enableShutdownHooks()
  app.useLogger(app.get(Logger))
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true
  })
  app.disable('x-powered-by')

  const config = new DocumentBuilder()
    .addBearerAuth({ in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    ).setTitle('Swagger BlackBox - OpenApi 3.0')
    .setDescription('BlackBox demo Nest.js API documentation')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .build()
  const document = SwaggerModule.createDocument(app, config, { include: [UserModule, AuthModule, ProjectModule, EpicModule, TeamModule] })
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'BlackBox API Documentation' })

  await app.listen(3000)
}

bootstrap()
