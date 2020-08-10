import express from "express"
import 'colorts/lib/string';
import cors from 'cors'
import expressFileUpload from 'express-fileupload'
import connectDB from "./config/db";
import { config } from './config/config';
import morgan from 'morgan'
import errorHandler from "./middleware/error";
import path from 'path';
import seederRun from "./seeder";
import http from 'http'
import socket from 'socket.io'
import { socketConnect } from './socket/socket.connect';

//Import Routes
import clubsRouter from './routes/clubs.routes'
import authRouter from './routes/auth.routes'
import usersRouter from './routes/user.routes'
import messageRouter from './routes/message.routes'
//Routes<Starava>
import stravaRoutes from './third-party-services/strava/routes/strava.routes'

let userId = ''
//Connect to database
connectDB();
const new1 = seederRun + 3
// start app
const app = express();

// Native server with Express
const server = http.createServer(app)

// Connect Socket.io
export const io = socket(server)
io.on('connect', socketConnect)


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
// app.use('/*',express.static(path.join(__dirname,'..', 'public')));
app.use(express.static(path.join(__dirname,'..', 'public')));


//Routes
app.use('/api/v1/strava',stravaRoutes)
app.use('/api/v1/clubs', clubsRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/messages', messageRouter)
// Routes<Strava>
// app.use('/api/v1/events')

//FE rout
app.use('*',(req, res, next) => {
  res.sendFile(path.join(__dirname,'..', 'public/index.html'))
})

app.use(errorHandler);

const PORT = config.PORT || 5000;

server.listen(
    PORT, () => {
        console.log(
            `Server running in ${ process.env.NODE_ENV } mode on port ${ PORT }`.yellow.bold
        )
    }
);
//Handle unhandled promise rejections
// @ts-ignore
process.on('unhandledRejection', (err: { message: string }, promise) => {
    console.log(`Error: ${ err.message }`.red);
    //Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;
