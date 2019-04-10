// Main starting point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
// const config = require('./config/config');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const isLocal = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development';
const isDev = process.env.NODE_ENV !== 'production';

// DB Setup
// mongoose.connect(isLocal ? config.db_local : isDev ? config.db_dev : config.db, { useNewUrlParser: true }); // Creates new database calls

// App Setup
app.use(morgan('combined')); // logging framework
app.use(cors());
app.use(bodyParser.json({type: '*/*'})); // parse incoming requests into json no matter type
router(app);

// Server Setup
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port);
console.log('\n\n\n\n\n\n\n\n\n\nServer listening on:', port);
