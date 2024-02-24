require('dotenv').config();
import * as mongoose from 'mongoose'

const connectDB = async () => {
    try {
      if (process.env.MONGO_URI !== undefined) {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          autoIndex: true,
        })
  
        console.log(`MongoDB Connected: ${conn.connection.host}`)
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  }
  
  export default connectDB