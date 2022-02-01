import debug from 'debug'
import app from './src/app'
import dotenv from 'dotenv'
import connectDB from './src/server/db'
dotenv.config()

connectDB()
  .then(() => {
    app.listen(process.env.DB_PORT, () => {
      debug(
        `server is running on port ${process.env.DB_PORT} and in ${process.env.DB_MODE} mode`,
      )
      console.log(
        `server is running on port ${process.env.DB_PORT} and in ${process.env.DB_MODE} mode`,
      )
    })
  })
  .catch((error: any) => {
    console.log(error)
  })
export default connectDB
