"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require("colorts/lib/string");
//Load models
const club_1 = __importDefault(require("./models/club"));
const event_1 = __importDefault(require("./models/event"));
const user_1 = __importDefault(require("./models/user"));
const post_1 = __importDefault(require("./models/post"));
//Connect to DB
mongoose.connect(config_1.config.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
console.log(`${config_1.config.MONGO_URI} was connected`.green);
// Read JSON file
const clubs = JSON.parse(fs.readFileSync(`${__dirname}/_data/clubs.json`, 'utf-8'));
const events = JSON.parse(fs.readFileSync(`${__dirname}/_data/events.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const posts = JSON.parse(fs.readFileSync(`${__dirname}/_data/posts.json`, 'utf-8'));
//Import into DB
const importData = async () => {
    try {
        await club_1.default.create(clubs);
        await event_1.default.create(events);
        await user_1.default.create(users);
        await post_1.default.create(posts);
        console.log('Data Imported...'.green.inverse);
        process.exit();
    }
    catch (e) {
        console.error(e);
        process.exit();
    }
};
//Delete date
const deleteData = async () => {
    try {
        await club_1.default.deleteMany({});
        await event_1.default.deleteMany({});
        await user_1.default.deleteMany({});
        await post_1.default.deleteMany({});
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    }
    catch (e) {
        console.error(e);
        process.exit();
    }
};
if (process.argv[2] === '-i') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}
const seederRun = 10;
exports.default = seederRun;
//# sourceMappingURL=seeder.js.map