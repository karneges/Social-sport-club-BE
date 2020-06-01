"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("colorts/lib/string");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const config_1 = require("./config/config");
const morgan_1 = __importDefault(require("morgan"));
const error_1 = __importDefault(require("./middleware/error"));
const seeder_1 = __importDefault(require("./seeder"));
//Connect to database
db_1.default();
const new1 = seeder_1.default + 3;
// start app
const app = express_1.default();
app.use(morgan_1.default('dev'));
// Add Cors
app.use(cors_1.default());
//Add body parser
app.use(express_1.default.json());
// file uploader
// app.use(expressFileUpload());
// Use static Folders
// app.use(express.static(path.join(__dirname ,'..','static')));
// app.use('/', express.static(path.join(__dirname ,'..','static/angular')));
//Routes
//FE rout
// app.use('*',(req, res, next) => {
//   res.sendFile(path.join(__dirname,'..', 'static', 'angular/index.html'))
// })
app.use(error_1.default);
const PORT = config_1.config.PORT || 3000;
const server = app.listen(PORT, () => {
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