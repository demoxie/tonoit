import mongoose from 'mongoose'
import dotenv from 'dotenv'
mongoose.Promise = global.Promise
dotenv.config()
const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

const connectDB: any = async (): Promise<void> => {

  try {
    
    await mongoose.connect(`${DB_HOST}`)

    // callback when connection to mongodb is open
    await mongoose.connection.once('open', ()=> {
      console.log('MongoDB database connection established successfully')
    })
  } catch (error: any) {
    console.log(error)
  }
}
export default connectDB
