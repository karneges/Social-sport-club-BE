import { config } from "./config/config";

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
import 'colorts/lib/string';

//Load models
import Club from './models/club'
import Event  from './models/event'
import User  from './models/user'
import Post  from './models/post'
import Message from './models/message'

//Connect to DB

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
console.log(`${config.MONGO_URI} was connected`.green);

// Read JSON file

const clubs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/clubs.json`, 'utf-8')
);
const events = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/events.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/posts.json`, 'utf-8')
);
const messages = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/messages.json`, 'utf-8')
);

//Import into DB

const importData = async () => {
  try {
    await Club.create(clubs);
    await Event.create(events);
    await User.create(users);
    await Post.create(posts);
    await Message.create(messages);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit();
  }
};

//Delete date

const deleteData = async () => {
  try {
    await Club.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    await Post.deleteMany({});
    await Message.deleteMany({});
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit();
  }
};
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
const seederRun = 10
export default seederRun
