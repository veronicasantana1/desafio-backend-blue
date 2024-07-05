import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
	type: 'sqlite',
    database: './src/database/database.sqlite',
	entities: [`${__dirname}/**/entity/*.{ts,js}`],
	migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
    synchronize: true,
    logging: true,
})