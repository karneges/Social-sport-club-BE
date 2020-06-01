import mongoose from 'mongoose'
import {config} from "./config";
import colors from 'colors'
const connectDB = async () => {
  const conn = await mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected:${conn.connection.host}`.cyan.underline.bold);
};

export default connectDB;
