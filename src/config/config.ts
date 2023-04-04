const nest_db_local = {
  host: 'localhost',
  username: 'postgres',
  database: 'nest_db',
  password: 'admin',
  port: 5433
}


process.env.stage = process.env.stage || 'local'

export const mainConfig = {
  postgres: (process.env.stage != 'local') ? JSON.parse(process.env[`nest_db_${process.env.stage}`] || '{}') : nest_db_local,

}