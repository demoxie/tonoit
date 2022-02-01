import express from 'express'

import cookieParser from 'cookie-parser'
import router from '../src/routes/all_routes'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
dotenv.config()

const app: express.Application = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))
app.use(cors())
app.use(router)

export default app
