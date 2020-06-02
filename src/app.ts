import express from "express"
import 'colorts/lib/string';
import  cors from 'cors'
import  expressFileUpload from 'express-fileupload'
import connectDB from "./config/db";
import { config } from './config/config';
import morgan from 'morgan'
import errorHandler from "./middleware/error";
import path from 'path';
import seederRun from "./seeder";

import clubsRouter from './routes/clubs.routes'



//Connect to database
connectDB();
const new1 =  seederRun +3
// start app
const app = express();

app.use(morgan('dev'))
// Add Cors
app.use(cors())
//Add body parser
app.use(express.json())
// file uploader
app.use(expressFileUpload());

// Use static Folders
// app.use(express.static(path.join(__dirname ,'..','static')));
// app.use('/', express.static(path.join(__dirname ,'..','static/angular')));

//Routes
app.use('/api/v1/clubs', clubsRouter)
// app.use('/api/v1/users')
// app.use('/api/v1/events')

//FE rout
// app.use('*',(req, res, next) => {
//   res.sendFile(path.join(__dirname,'..', 'static', 'angular/index.html'))
// })

app.use(errorHandler);

const PORT = config.PORT || 3000;

const server = app.listen(
  PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
  }
);
//Handle unhandled promise rejections
// @ts-ignore
process.on('unhandledRejection', (err: { message: string }, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
