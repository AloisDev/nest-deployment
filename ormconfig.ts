require('dotenv').config()
import path from 'path'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { mainConfig } from './src/config/config'

const distPath = 'dist'
const buildPath = '.build'
let entitiesPath = '/src/entities/**/*.js'
const migrationPath = path.resolve(__dirname, 'src/db/migrations', '*.ts')

if (__dirname.includes('.build')) {
  entitiesPath = path.join(buildPath, entitiesPath)
} else {
  entitiesPath = path.join(distPath, entitiesPath)
}

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  // logging: 'all' || ['query', 'error'],
  host: mainConfig.postgres.host,
  username: mainConfig.postgres.username,
  database: mainConfig.postgres.database,
  password: mainConfig.postgres.password,
  port: mainConfig.postgres.port,
  entities: [entitiesPath],
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true, // NEVER set this to TRUE for PRODUCTION
  migrations: [migrationPath],
}
export default new DataSource(config)