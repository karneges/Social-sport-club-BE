"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
require("colorts/lib/string");
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const db_1 = __importDefault(require("./config/db"));
const config_1 = require("./config/config");
const morgan_1 = __importDefault(require("morgan"));
const error_1 = __importDefault(require("./middleware/error"));
const seeder_1 = __importDefault(require("./seeder"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const clubs_routes_1 = __importDefault(require("./routes/clubs.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const socket_connect_1 = require("./socket/socket.connect");
let userId = '';
//Connect to database
db_1.default();
const new1 = seeder_1.default + 3;
// start app
const app = express_1.default();
// Native server with Express
const server = http_1.default.createServer(app);
// Connect Socket.io
exports.io = socket_io_1.default(server);
exports.io.on('connect', socket_connect_1.socketConnect);
app.use(morgan_1.default('dev'));
// Add Cors
app.use(cors_1.default());
//Add body parser
app.use(express_1.default.json());
// file uploader
app.use(express_fileupload_1.default());
// Use static Folders
// app.use(express.static(path.join(__dirname ,'..','static')));
// app.use('/', express.static(path.join(__dirname ,'..','static/angular')));
//Routes
app.use('/api/v1/clubs', clubs_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/messages', message_routes_1.default);
// app.use('/api/v1/events')
//FE rout
// app.use('*',(req, res, next) => {
//   res.sendFile(path.join(__dirname,'..', 'static', 'angular/index.html'))
// })
app.use(error_1.default);
const PORT = config_1.config.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
//Handle unhandled promise rejections
// @ts-ignore
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server & exit process
    server.close(() => process.exit(1));
});
module.exports = app;
//# sourceMappingURL=app.js.map