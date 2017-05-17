'use strict';

require('dotenv').config();
const mBot = require('./src/mBot');
const Koa = require('koa');
const server = new Koa();
const bodyParser = require('koa-bodyparser');

// KOA middlewares
server.use(bodyParser());

// mBot middleware
server.use(mBot.koa({
    apiVersion: 'v2.8',
    verifyToken: process.env.VERIFY_TOKEN,
    pageToken: process.env.FB_PAGE_ACCESS_TOKEN
}));

if (process.env.NODE_ENV === 'testing' && !module.parent) {
    server.listen(process.env.PORT, () => {
        console.log('Running Koa server on port ' + process.env.PORT + ' with ' + process.env.NODE_ENV + ' environment');
    });
} else if (process.env.NODE_ENV === 'development') {
    server.listen(process.env.PORT, () => {
        console.log('Running Koa server on port ' + process.env.PORT + ' with ' + process.env.NODE_ENV + ' environment');
    });
} else if (process.env.NODE_ENV === 'production') {
    server.listen(process.env.PORT, () => {
        console.log('Running Koa server on port ' + process.env.PORT + ' with ' + process.env.NODE_ENV + ' environment');
    });
}

module.exports = server;